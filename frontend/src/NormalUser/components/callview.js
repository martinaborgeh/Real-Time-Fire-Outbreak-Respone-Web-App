import React, { useRef,useState, useEffect } from 'react';
import { Link,useNavigate} from 'react-router-dom';

import VideoComponent from './VideoComponent';
import NormalUserWebSocketService from './normaluserwebsocketservice'

export function NormalUserCallView() {
  const [localStream, setLocalStream] = useState(null);
  const socketRef = useRef();
    const serverbaseurl = "http://localhost:8000";

    const navigate =  useNavigate ()

    useEffect(() => {
        fetch(serverbaseurl + "/accounts/check-if-user-is-authenticated/", {
          method: 'GET',
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(response_data => {
            if (!response_data.ok) {
              if (response_data.status === 401) {
                console.log("Not Authorized, Enter V");
              } else if (response_data.status === 400) {
                console.log("Something Bad Happened, We would resolve it soon");
                navigate("/error-message");
              }
            } else {
              return response_data.json();
            }
          })
          .catch(error => {
            console.error('Authorization Error:', error.message);
          });
      }, [navigate]);; // Empty dependency array ensures this effect runs only once on mount

   

      const handleStartCall = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        // Create WebSocket connection
        const roomName= "Caller ID"
        await NormalUserWebSocketService.connect(roomName);
        socketRef.current = NormalUserWebSocketService;
        socketRef.current.listen(handleSocketMessage);

        // Create PeerConnection and send offer
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        pc.addStream(stream);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.send({
                    type: 'candidate',
                    candidate: event.candidate,
                });
            }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socketRef.current.send({
            type: 'offer',
            offer: offer,
        });
    };

    const handleSocketMessage = (message) => {
      const { type, answer, candidate } = message;

      switch (type) {
          case 'answer':
              handleReceiveAnswer(answer);
              break;
          case 'candidate':
              handleReceiveCandidate(candidate);
              break;
          default:
              break;
      }
  };


  const handleReceiveAnswer = async (answer) => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    pc.addStream(localStream);

    await pc.setRemoteDescription(new RTCSessionDescription(answer));
};

const handleReceiveCandidate = (candidate) => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    pc.addStream(localStream);

    pc.addIceCandidate(new RTCIceCandidate(candidate));
};
  
    return (
      <div>
      
          <div>
              <VideoComponent stream={localStream} isMuted={true} />
          </div>
          <div>
              <button onClick={handleStartCall}>Start Call</button>
          </div>
      </div>
  );
  
}