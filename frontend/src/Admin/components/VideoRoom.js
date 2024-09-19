import React, { useState, useEffect } from 'react';

import backendBaseurl from "../../dev_prod_config";

const backend_server_url = backendBaseurl(window._env_.REACT_APP_SERVER_MODE);

const ICE_SERVERS = [
  { urls: "stun:stun.relay.metered.ca:80" },
  { urls: "turn:global.relay.metered.ca:80", username: "9010831e2cdd7616078e5ffb", credential: "fEAeua6MU5raL2Ds" },
  { urls: "turn:global.relay.metered.ca:80?transport=tcp", username: "9010831e2cdd7616078e5ffb", credential: "fEAeua6MU5raL2Ds" },
  { urls: "turn:global.relay.metered.ca:443", username: "9010831e2cdd7616078e5ffb", credential: "fEAeua6MU5raL2Ds" },
  { urls: "turns:global.relay.metered.ca:443?transport=tcp", username: "9010831e2cdd7616078e5ffb", credential: "fEAeua6MU5raL2Ds" },
];

const AdminVideoRoom = ({ navigate, userDetails }) => {
  const [websocket, setWebsocket] = useState(null);
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoRoomAccessible, setIsVideoRoomAccessible] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callRequested, setCallRequested] = useState(false);
  const [normaluserId, setNormalUserId] = useState(null);

  console.log(userDetails)
  const { userId, full_name } = userDetails;


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
    if (callRequested) {
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
      setNormalUserId(otherUserId);
      setIncomingCall(null);
      setCallRequested(false); // Reset call requested status
    }
  };

  const handleCandidate = async (candidate, otherUserId) => {
    const peerConnection = peers[otherUserId];
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const acceptCall = (otherUserId) => {
    setCallRequested(true);
    // After accepting, handle the offer
    // No UI here for simplicity, but you can show a modal/dialog if needed
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
              setIncomingCall(data.from);
              return; // Wait for manual acceptance
            }
            await handleOffer(data.offer, data.from);
            setNormalUserId(data.from);
            break;

          case 'sending_answer':
            // Not needed for Admin
            break;

          case 'sending_candidate':
            await handleCandidate(data.candidate, data.from);
            break;

          case 'disconnected':
            if (data.from !== userId && data.from === normaluserId) {
              setNormalUserId(null);
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
  }, [navigate, userId, full_name]);

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
          {incomingCall && !callRequested && (
            <div className="fixed bottom-4 right-4 bg-white p-4 border rounded shadow-lg">
              <p>Incoming call from {incomingCall}</p>
              <button
                                onClick={() => acceptCall(incomingCall)}
                                className="p-2 bg-green-500 text-white rounded mr-2"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => setIncomingCall(null)}
                                className="p-2 bg-red-500 text-white rounded"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          <div className="video-controls flex justify-between mt-4">
                            <button
                              onClick={muteVideo}
                              className="p-2 bg-gray-500 text-white rounded"
                            >
                              {isVideoMuted ? 'Unmute Video' : 'Mute Video'}
                            </button>
                            <button
                              onClick={muteAudio}
                              className="p-2 bg-gray-500 text-white rounded"
                            >
                              {isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
                            </button>
                            <button
                              onClick={leaveRoom}
                              className="p-2 bg-red-500 text-white rounded"
                            >
                              Leave Room
                            </button>
                          </div>
                          {/* Display remote videos */}
                          {Object.keys(peers).map(peerId => (
                            <video
                              key={peerId}
                              id={`remote-${peerId}`}
                              autoPlay
                              className="w-full h-64 mt-4 border border-gray-300"
                            />
                          ))}
                          {/* Display the local video stream */}
                          {stream && (
                            <video
                              id="local-video"
                              autoPlay
                              muted
                              className="w-full h-64 border border-gray-300"
                              srcObject={stream}
                            />
                          )}
                        </>
                      ) : (
                        <p>Your browser does not support video calls. Please use a modern browser with HTTPS.</p>
                      )}
                    </div>
                  );
                };
                
                export default AdminVideoRoom;
                
