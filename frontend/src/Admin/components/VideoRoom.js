// AdminVideoRoom.js

// import React, { useState, useEffect } from 'react';
// import jwtDecode from 'jwt-decode';
// import backendBaseurl from "../../dev_prod_config";
// const backend_server_url = backendBaseurl(window._env_.REACT_APP_SERVER_MODE);

// // STUN and TURN server configuration
// const ICE_SERVERS = [
//   { urls: 'stun:stun.l.google.com:19302' },
//   {
//     urls: 'turn:your-turn-server.com',
//     username: 'your-turn-username',
//     credential: 'your-turn-credential',
//   },
// ];

// const AdminVideoRoom = ({ navigate, roomId }) => {
//   const [websocket, setWebsocket] = useState(null);
//   const [stream, setStream] = useState(null);
//   const [peers, setPeers] = useState({});
//   const [isVideoMuted, setIsVideoMuted] = useState(false);
//   const [isAudioMuted, setIsAudioMuted] = useState(false);
//   const [contentLoading, setContentLoading] = useState(true);
//   const [isVideoRoomAccessible, setIsVideoRoomAccessible] = useState(true);
//   const token = localStorage.getItem('access');

//   const decoded_token = token ? jwtDecode(token) : navigate("/login-admin");
//   const { userId, userFullName } = token ? [decoded_token.user._id, decoded_token.user_full_name] : navigate("/login-admin");

//   const printFeedback = ({ type, feedbackMsg }) => {
//     if (type === 'error') {
//       alert(`Error: ${feedbackMsg}`);
//     } else if (type === 'success') {
//       alert(`Success: ${feedbackMsg}`);
//     } else {
//       console.log(feedbackMsg);
//     }
//   };

//   const createPeerConnection = (otherUserId) => {
//     const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

//     if (stream) {
//       stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
//     }

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         websocket.send(JSON.stringify({
//           type: 'sending_candidate',
//           from: userId,
//           to: otherUserId,
//           candidate: event.candidate,
//         }));
//       }
//     };

//     peerConnection.ontrack = (event) => {
//       const remoteVideoElement = document.getElementById(`remote-${otherUserId}`);
//       if (remoteVideoElement) {
//         remoteVideoElement.srcObject = event.streams[0];
//       }
//     };

//     return peerConnection;
//   };

//   const handleOffer = async (offer, otherUserId) => {
//     const peerConnection = createPeerConnection(otherUserId);
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);

//     websocket.send(JSON.stringify({
//       type: 'sending_answer',
//       from: userId,
//       to: otherUserId,
//       answer: peerConnection.localDescription,
//     }));

//     setPeers(prevPeers => ({
//       ...prevPeers,
//       [otherUserId]: peerConnection
//     }));
//   };

//   const handleCandidate = async (candidate, otherUserId) => {
//     const peerConnection = peers[otherUserId];
//     if (peerConnection) {
//       await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//     }
//   };

//   useEffect(() => {
//     if (!navigator.mediaDevices) {
//       setIsVideoRoomAccessible(false);
//       printFeedback({
//         type: 'error',
//         feedbackMsg: 'This video room is not accessible because the site is not running on a secure protocol, i.e., "HTTPS".',
//       });
//       return;
//     }

//     const websocket = new WebSocket(`ws://${backend_server_url}/video/${roomId}/`);
//     setWebsocket(websocket);

//     websocket.onopen = () => {
//       setContentLoading(true);

//       websocket.send(
//         JSON.stringify({
//           type: 'new_user_joined',
//           from: userId,
//           to:"other id",
//           user_full_name: userFullName,
//           token: localStorage.getItem('access_token'),
//         })
//       );
//     };

//     websocket.onmessage = async (payload) => {
//       const data = JSON.parse(payload.data);

//       switch (data.type) {
//         case 'sending_offer':
//           if (data.to === userId) {
//             await handleOffer(data.offer, data.from);
//           }
//           break;

//         case 'sending_answer':
//           // Not handled in Admin
//           break;

//         case 'sending_candidate':
//           if (data.to === userId) {
//             await handleCandidate(data.candidate, data.from);
//           }
//           break;

//         case 'disconnected':
//           if (data.from !== userId & data.from ==="normal user") {
//             printFeedback({
//               type: 'error',
//               feedbackMsg: `${data.full_name} left`,
//             });
//             console.log(`User No. ${data.from} disconnected`);

//             const peerConnection = peers[data.from];
//             if (peerConnection) {
//               peerConnection.close();
//               setPeers(prevPeers => {
//                 const newPeers = { ...prevPeers };
//                 delete newPeers[data.from];
//                 return newPeers;
//               });
//             }
//           }
//           break;

//         default:
//           break;
//       }
//     };

//     return () => {
//       if (websocket) {
//         websocket.close();
//       }
//       Object.values(peers).forEach(peerConnection => peerConnection.close());
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//       setWebsocket(null);
//       setStream(null);
//       setPeers({});
//       setIsVideoMuted(true);
//       setIsAudioMuted(true);
//     };
//   }, [navigate, roomId, userId, userFullName, stream, peers]);

//   const muteVideo = () => {
//     const videoTracks = stream?.getVideoTracks();
//     if (videoTracks.length > 0) {
//       videoTracks[0].enabled = !videoTracks[0].enabled;
//       setIsVideoMuted(!videoTracks[0].enabled);
//     }
//   };

//   const muteAudio = () => {
//     const audioTracks = stream?.getAudioTracks();
//     if (audioTracks.length > 0) {
//       audioTracks[0].enabled = !audioTracks[0].enabled;
//       setIsAudioMuted(!audioTracks[0].enabled);
//     }
//   };

//   const leaveRoom = () => {
//     navigate("/end-call-view");
//   };

//   return (
//     <div className="p-4">
//       {isVideoRoomAccessible ? (
//         <>
//           <div className="fixed bottom-4 right-4 flex flex-col space-y-4">
//             {/* Video Mute/Unmute */}
//             <button
//               onClick={muteVideo}
//               className={`p-4 rounded-full ${isVideoMuted ? 'bg-red-500' : 'bg-green-500'} text-white`}
//               title="Video ON/OFF"
//             >
//               {isVideoMuted ? (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M15.5 12a3.5 3.5 0 0 0-6.5-2.5" />
//                   <path d="M9 10a3.5 3.5 0 0 0 6.5 2.5" />
//                 </svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M9 10a3.5 3.5 0 0 0 6.5 2.5" />
//                 </svg>
//               )}
//             </button>

//             {/* Audio Mute/Unmute */}
//             <button
//               onClick={muteAudio}
//               className={`p-4 rounded-full ${isAudioMuted ? 'bg-red-500' : 'bg-green-500'} text-white`}
//               title="Audio ON/OFF"
//             >
//               {isAudioMuted ? (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M16.5 15a3.5 3.5 0 0 0-6.5-2.5" />
//                 </svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M7 10a3.5 3.5 0 0 0 6.5 2.5" />
//                 </svg>
//               )}
//             </button>

//             {/* Leave Room */}
//             <button
//               onClick={leaveRoom}
//               className="p-4 rounded-full bg-red-500 text-white"
//               title="Leave Room"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M10 9l-3 3 3 3" />
//                 <path d="M21 12H7" />
//               </svg>
//             </button>
//           </div>

//           {/* Video Elements */}
//           {Object.keys(peers).map(userId => (
//             <video key={userId} id={`remote-${userId}`} autoPlay playsInline />
//           ))}
//           <video id="localVideo" autoPlay muted playsInline />
//         </>
//       ) : (
//         <p>Video Room is not accessible.</p>
//       )}
//     </div>
//   );
// };

// export default AdminVideoRoom;


// AdminVideoRoom.js

// AdminVideoRoom.js

import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import backendBaseurl from "../../dev_prod_config";
const backend_server_url = backendBaseurl(window._env_.REACT_APP_SERVER_MODE);



ICE_SERVERS= [
  {
    urls: "stun:stun.relay.metered.ca:80",
  },
  {
    urls: "turn:global.relay.metered.ca:80",
    username: "9010831e2cdd7616078e5ffb",
    credential: "fEAeua6MU5raL2Ds",
  },
  {
    urls: "turn:global.relay.metered.ca:80?transport=tcp",
    username: "9010831e2cdd7616078e5ffb",
    credential: "fEAeua6MU5raL2Ds",
  },
  {
    urls: "turn:global.relay.metered.ca:443",
    username: "9010831e2cdd7616078e5ffb",
    credential: "fEAeua6MU5raL2Ds",
  },
  {
    urls: "turns:global.relay.metered.ca:443?transport=tcp",
    username: "9010831e2cdd7616078e5ffb",
    credential: "fEAeua6MU5raL2Ds",
  },
]

const AdminVideoRoom = ({ navigate,userDetails}) => {
  const [websocket, setWebsocket] = useState(null);
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoRoomAccessible, setIsVideoRoomAccessible] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [callRequested, setCallRequested] = useState(false); // To handle manual call acceptance
  const [normaluser_id, setNormalUserID] = useState(null)
  const {userId, full_name} = userDetails
  

  const printFeedback = ({ type, feedbackMsg }) => {
    if (type === 'error') {
      alert(`Error: ${feedbackMsg}`);
    } else if (type === 'success') {
      alert(`Success: ${feedbackMsg}`);
    } else {
      console.log(feedbackMsg);
    }
  };

  const createPeerConnection = (otherUserId) => {
    const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    if (stream) {
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        websocket.send(JSON.stringify({
          type: 'sending_candidate',
          from: userId,
          to: otherUserId,
          candidate: event.candidate,
        }));
      }
    };

    peerConnection.ontrack = (event) => {
      const remoteVideoElement = document.getElementById(`remote-${otherUserId}`);
      if (remoteVideoElement) {
        remoteVideoElement.srcObject = event.streams[0];
      }
    };

    return peerConnection;
  };

  const handleOffer = async (offer, otherUserId) => {
    const peerConnection = createPeerConnection(otherUserId);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    websocket.send(JSON.stringify({
      type: 'sending_answer',
      from: userId,
      to: otherUserId,
      answer: answer,
    }));

    setPeers(prevPeers => ({
      ...prevPeers,
      [otherUserId]: peerConnection
    }));
  };

  const handleCandidate = async (candidate, otherUserId) => {
    const peerConnection = peers[otherUserId];
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const acceptCall = (otherUserId) => {
    setCallRequested(true); // Mark call as requested
    // Additional logic to display a prompt or UI for manual acceptance can be added here
  };

  const handleReconnect = () => {
    setIsReconnecting(true);
    reconnectWebSocket();
    setIsReconnecting(false);
  };

  const reconnectWebSocket = () => {
    const reconnectInterval = 5000; // 5 seconds

    const connect = () => {
      const ws = new WebSocket(`ws://${backend_server_url}/video/${2412}/`);
      setWebsocket(ws);

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'new_user_joined',
          from: userId,
          full_name: full_name,
         
        }));
      };

      ws.onmessage = async (payload) => {
        const data = JSON.parse(payload.data);

        switch (data.type) {
          case 'sending_offer':
            if (!callRequested) {
              acceptCall(data.from);
              return; // Wait for manual acceptance
            }
            await handleOffer(data.offer, data.from);
            setNormalUserID(data.from)
            break;

          case 'sending_answer':
            // Not needed for Admin
            break;

          case 'sending_candidate':
            await handleCandidate(data.candidate, data.from);
            break;

          case 'disconnected':
            if (data.from !== userId & data.from === normaluser_id) {
              setNormalUserID(null)
              printFeedback({
                type: 'error',
                feedbackMsg: `${data.full_name} left`,
              });
              console.log(`User No. ${data.from} disconnected`);

              const peerConnection = peers[data.from];
              if (peerConnection) {
                peerConnection.close();
                setPeers(prevPeers => {
                  const newPeers = { ...prevPeers };
                  delete newPeers[data.from];
                  return newPeers;
                });
              }
            }
            break;

          default:
            break;
        }
      };

      ws.onclose = () => {
        setWebsocket(null);
        setTimeout(connect, reconnectInterval);
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error: ', error);
        ws.close();
      };
    };

    connect();
  };

  useEffect(() => {
    if (!navigator.mediaDevices) {
      setIsVideoRoomAccessible(false);
      printFeedback({
        type: 'error',
        feedbackMsg: 'This video room is not accessible because the site is not running on a secure protocol, i.e., "HTTPS".',
      });
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setStream(stream);
        reconnectWebSocket();
      })
      .catch(error => {
        printFeedback({
          type: 'error',
          feedbackMsg: `Failed to get media stream: ${error.message}`,
        });
      });

    return () => {
      if (websocket) {
        websocket.close();
      }
      Object.values(peers).forEach(peerConnection => peerConnection.close());
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setWebsocket(null);
      setStream(null);
      setPeers({});
      setIsVideoMuted(true);
      setIsAudioMuted(true);
    };
  }, [navigate]);

  const muteVideo = () => {
    const videoTracks = stream?.getVideoTracks();
    if (videoTracks.length > 0) {
      videoTracks[0].enabled = !videoTracks[0].enabled;
      setIsVideoMuted(!videoTracks[0].enabled);
    }
  };

  const muteAudio = () => {
    const audioTracks = stream?.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks[0].enabled = !audioTracks[0].enabled;
      setIsAudioMuted(!audioTracks[0].enabled);
    }
  };

  const leaveRoom = () => {
    navigate("/end-call-view");
  };

  return (
    <div className="p-4">
      {isVideoRoomAccessible ? (
        <>
          {isReconnecting && <p>Attempting to reconnect...</p>}
          <button
            onClick={handleReconnect}
            className="p-4 rounded-full bg-blue-500 text-white"
            disabled={isReconnecting}
          >
            Reconnect
          </button>
          <div className="fixed bottom-4 right-4 flex flex-col space-y-4">
            <button
              onClick={muteVideo}
              className={`p-4 rounded-full ${isVideoMuted ? 'bg-red-500' : 'bg-green-500'} text-white`}
              title="Video ON/OFF"
            >
              {isVideoMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.5 12a3.5 3.5 0 0 0-6.5-2.5" />
                  <path d="M9 10a3.5 3.5 0 0 0 6.5 2.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 10a3.5 3.5 0 0 0 6.5 2.5" />
                </svg>
              )}
            </button>
            <button
              onClick={muteAudio}
              className={`p-4 rounded-full ${isAudioMuted ? 'bg-red-500' : 'bg-green-500'} text-white`}
              title="Audio ON/OFF"
            >
              {isAudioMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.5 15a3.5 3.5 0 0 0-6.5-2.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 10a3.5 3.5 0 0 0 6.5 2.5" />
                </svg>
              )}
            </button>
            <button
              onClick={leaveRoom}
              className="p-4 rounded-full bg-red-500 text-white"
              title="Leave Room"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 9l-3 3 3 3" />
                <path d="M21 12H7" />
              </svg>
            </button>
          </div>
          {/* Video Elements */}
          {Object.keys(peers).map(userId => (
            <video key={userId} id={`remote-${userId}`} autoPlay playsInline />
          ))}
          <video id="localVideo" autoPlay muted playsInline />
        </>
      ) : (
        <p>Access to the video room is restricted.</p>
      )}
    </div>
  );
};

export default AdminVideoRoom;
