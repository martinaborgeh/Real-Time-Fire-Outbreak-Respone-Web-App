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

// const VideoRoom = ({ navigate, roomId }) => {
//   const [websocket, setWebsocket] = useState(null);
//   const [stream, setStream] = useState(null);
//   const [usersConnected, setUsersConnected] = useState([]);
//   const [peers, setPeers] = useState({});
//   const [isVideoMuted, setIsVideoMuted] = useState(false);
//   const [isAudioMuted, setIsAudioMuted] = useState(false);
//   const [contentLoading, setContentLoading] = useState(true);
//   const [isVideoRoomAccessible, setIsVideoRoomAccessible] = useState(true);
//   const token = localStorage.getItem('access_token');
  
//   const decoded_token = token ? jwtDecode(token) : navigate("/login-normal-user");
//   const { userId, userFullName } = token ? [decoded_token.user._id, decoded_token.user_full_name] : navigate("/login-normal-user");

//   const printFeedback = ({ type, feedbackMsg }) => {
//     if (type === 'error') {
//       alert(`Error: ${feedbackMsg}`);
//     } else if (type === 'success') {
//       alert(`Success: ${feedbackMsg}`);
//     } else {
//       console.log(feedbackMsg);
//     }
//   };

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

//   const createPeerConnection = (initiator, otherUserId) => {
//     const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

//     // Add tracks from local stream to the peer connection
//     if (stream) {
//       stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
//     }

//     // Handle ICE candidates
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

//     // Handle incoming tracks
//     peerConnection.ontrack = (event) => {
//       const remoteVideoElement = document.getElementById(`remote-${otherUserId}`);
//       if (remoteVideoElement) {
//         remoteVideoElement.srcObject = event.streams[0];
//       }
//     };

//     if (initiator) {
//       peerConnection.onnegotiationneeded = async () => {
//         try {
//           const offer = await peerConnection.createOffer();
//           await peerConnection.setLocalDescription(offer);

//           websocket.send(JSON.stringify({
//             type: 'sending_offer',
//             from: userId,
//             to: otherUserId,
//             offer: peerConnection.localDescription,
//           }));
//         } catch (error) {
//           console.error('Error creating offer:', error);
//         }
//       };
//     }

//     return peerConnection;
//   };

//   const handleOffer = async (offer, otherUserId) => {
//     const peerConnection = createPeerConnection(false, otherUserId);
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

//   const handleAnswer = async (answer, otherUserId) => {
//     const peerConnection = peers[otherUserId];
//     if (peerConnection) {
//       await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//     }
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

//     const websocket = new WebSocket(`ws://your-websocket-url/video/${roomId}/`);
//     setWebsocket(websocket);

//     websocket.onopen = () => {
//       setContentLoading(true);

//       websocket.send(
//         JSON.stringify({
//           type: 'new_user_joined',
//           from: userId,
//           user_full_name: userFullName,
//           token: localStorage.getItem('access_token'),
//         })
//       );
//     };

//     websocket.onmessage = async (payload) => {
//       const data = JSON.parse(payload.data);

//       switch (data.type) {
//         case 'new_user_joined':
//           setUsersConnected(data.users_connected);

//           if (userId === data.from) {
//             try {
//               const userStream = await navigator.mediaDevices.getUserMedia({
//                 video: true,
//                 audio: true,
//               });
//               setStream(userStream);
//               document.getElementById('localVideo').srcObject = userStream;

//               data.users_connected.forEach(user => {
//                 if (user.user_id !== userId) {
//                   const peerConnection = createPeerConnection(true, user.user_id);
//                   setPeers(prevPeers => ({
//                     ...prevPeers,
//                     [user.user_id]: peerConnection
//                   }));
//                 }
//               });
//             } catch (error) {
//               setIsVideoRoomAccessible(false);
//               printFeedback({
//                 type: 'error',
//                 feedbackMsg: 'You need to enable media devices to access this room.',
//               });
//               console.log(error.message);
//             }
//           } else {
//             printFeedback({
//               type: 'success',
//               feedbackMsg: `${data.user_full_name} joined this room`,
//             });
//             console.log(`User No. ${data.from} joined this room`);
//           }
//           break;

//         case 'sending_offer':
//           if (data.to === userId) {
//             await handleOffer(data.offer, data.from);
//           }
//           break;

//         case 'sending_answer':
//           if (data.to === userId) {
//             await handleAnswer(data.answer, data.from);
//           }
//           break;

//         case 'sending_candidate':
//           if (data.to === userId) {
//             await handleCandidate(data.candidate, data.from);
//           }
//           break;

//         case 'disconnected':
//           if (data.from !== userId) {
//             printFeedback({
//               type: 'error',
//               feedbackMsg: `${data.user_full_name} left`,
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
//       setUsersConnected([]);
//       setPeers({});
//       setIsVideoMuted(true);
//       setIsAudioMuted(true);
//     };
//   }, [navigate, roomId, userId, userFullName, stream, usersConnected, peers]);

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
//                   <path d="M9 10v6" />
//                   <path d="M12 15l3 3" />
//                 </svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M15.5 12a3.5 3.5 0 0 0-6.5-2.5" />
//                   <path d="M9 10a3.5 3.5 0 0 0 6.5 2.5" />
//                   <path d="M9 10v6" />
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
//                   <path d="M12 1v22" />
//                   <path d="M1 12l22-10v20L1 12z" />
//                 </svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M12 1v22" />
//                   <path d="M1 12l22-10v20L1 12z" />
//                 </svg>
//               )}
//             </button>

//             {/* Leave Room */}
//             <button
//               onClick={leaveRoom}
//               className="p-4 bg-red-600 rounded-full text-white"
//               title="Leave Room"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M12 4v16" />
//                 <path d="M5 12l7-7 7 7" />
//               </svg>
//             </button>
//           </div>
//           <div className="flex flex-col items-center">
//             <video id="localVideo" autoPlay muted className="w-64 h-64 mb-4" />
//             {usersConnected.map(user => (
//               <video key={user.user_id} id={`remote-${user.user_id}`} autoPlay className="w-64 h-64 mb-4" />
//             ))}
//           </div>
//         </>
//       ) : (
//         <p className="text-red-500">Your video room is not accessible.</p>
//       )}
//     </div>
//   );
// };

// export default VideoRoom;


// NormalUserVideoRoom.js

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

// const NormalUserVideoRoom = ({ navigate, roomId }) => {
//   const [websocket, setWebsocket] = useState(null);
//   const [stream, setStream] = useState(null);
//   const [usersConnected, setUsersConnected] = useState([]);
//   const [peers, setPeers] = useState({});
//   const [isVideoMuted, setIsVideoMuted] = useState(false);
//   const [isAudioMuted, setIsAudioMuted] = useState(false);
//   const [contentLoading, setContentLoading] = useState(true);
//   const [isVideoRoomAccessible, setIsVideoRoomAccessible] = useState(true);
//   const token = localStorage.getItem('access');

//   const decoded_token = token ? jwtDecode(token) : navigate("/login-normal-user");
//   const { userId, userFullName } = token ? [decoded_token.user._id, decoded_token.user.full_name] : navigate("/login-normal-user");

//   const printFeedback = ({ type, feedbackMsg }) => {
//     if (type === 'error') {
//       alert(`Error: ${feedbackMsg}`);
//     } else if (type === 'success') {
//       alert(`Success: ${feedbackMsg}`);
//     } else {
//       console.log(feedbackMsg);
//     }
//   };

//   const createPeerConnection = (initiator, otherUserId) => {
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

//     if (initiator) {
//       peerConnection.onnegotiationneeded = async () => {
//         try {
//           const offer = await peerConnection.createOffer();
//           await peerConnection.setLocalDescription(offer);

//           websocket.send(JSON.stringify({
//             type: 'sending_offer',
//             from: userId,
//             to: otherUserId,
//             offer: peerConnection.localDescription,
//           }));
//         } catch (error) {
//           console.error('Error creating offer:', error);
//         }
//       };
//     }

//     return peerConnection;
//   };

//   const handleAnswer = async (answer, otherUserId) => {
//     const peerConnection = peers[otherUserId];
//     if (peerConnection) {
//       await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//     }
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
//           to:"otherid here", // to be updated with fire station id
//           user_full_name: userFullName,
//           token: localStorage.getItem('access_token'),
//         })
//       );
//     };

//     websocket.onmessage = async (payload) => {
//       const data = JSON.parse(payload.data);

//       switch (data.type) {
//         case 'new_user_joined':
//           setUsersConnected(data.users_connected);

//           if (userId === data.from) {
//             try {
//               const userStream = await navigator.mediaDevices.getUserMedia({
//                 video: true,
//                 audio: true,
//               });
//               setStream(userStream);
//               document.getElementById('localVideo').srcObject = userStream;

//               data.users_connected.forEach(user => {
//                 if (user.user_id !== userId) {
//                   const peerConnection = createPeerConnection(true, user.user_id);
//                   setPeers(prevPeers => ({
//                     ...prevPeers,
//                     [user.user_id]: peerConnection
//                   }));
//                 }
//               });
//             } catch (error) {
//               setIsVideoRoomAccessible(false);
//               printFeedback({
//                 type: 'error',
//                 feedbackMsg: 'You need to enable media devices to access this room.',
//               });
//               console.log(error.message);
//             }
//           } else {
//             printFeedback({
//               type: 'success',
//               feedbackMsg: `${data.user_full_name} joined this room`,
//             });
//             console.log(`User No. ${data.from} joined this room`);
//           }
//           break;

//         case 'sending_offer':
//           // Not handled in NormalUser
//           break;

//         case 'sending_answer':
//           if (data.to === userId) {
//             await handleAnswer(data.answer, data.from);
//           }
//           break;

//         case 'sending_candidate':
//           if (data.to === userId) {
//             await handleCandidate(data.candidate, data.from);
//           }
//           break;

//         case 'disconnected':
//           if (data.from !== userId & data.from =="Admin ID") {
//             printFeedback({
//               type: 'error',
//               feedbackMsg: `Admin ${data.full_name} left`,
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
//       setUsersConnected([]);
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
//           <video id="localVideo" autoPlay muted playsInline />
//           {usersConnected.map(user => (
//             <video key={user.user_id} id={`remote-${user.user_id}`} autoPlay playsInline />
//           ))}
//         </>
//       ) : (
//         <p>Video Room is not accessible.</p>
//       )}
//     </div>
//   );
// };

// export default NormalUserVideoRoom;



// NormalUser.js

// NormalUser.js

import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import backendBaseurl from "../../dev_prod_config";
const backend_server_url = backendBaseurl(window._env_.REACT_APP_SERVER_MODE);

const ICE_SERVERS= [
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


const NormalUserCallVideoRoom = ({ navigate,admin_id }) => {
  const [websocket, setWebsocket] = useState(null);
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoRoomAccessible, setIsVideoRoomAccessible] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const token = localStorage.getItem('access');
  // const decoded_token = token ? jwtDecode(token) : navigate("/login");
  const decoded_token = token ? jwtDecode(token) : null;
  const userDetails = token ? [decoded_token.user._id, decoded_token.full_name]:null
  const userId  = userDetails!==null?userDetails[0]:console.log("User is not logged in")
  const full_name  = userDetails!==null ? userDetails[1]:console.log("User is not logged in")

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
      const remoteVideoElement = document.getElementById('remote-admin');
      if (remoteVideoElement) {
        remoteVideoElement.srcObject = event.streams[0];
      }
    };

    return peerConnection;
  };
  const handleCandidate = async (candidate) => {
    const peerConnection = peers['admin'];
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const handleAnswer = async (answer) => {
    const peerConnection = peers['admin'];
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const initiateCall = async () => {
    const peerConnection = createPeerConnection(admin_id);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    websocket.send(JSON.stringify({
      type: 'sending_offer',
      from: userId,
      to: admin_id,
      offer: offer,
    }));

    setPeers(prevPeers => ({
      ...prevPeers,
      ['admin']: peerConnection
    }));
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
          case 'sending_candidate':
            await handleCandidate(data.candidate);
            break;

          case 'sending_answer':
            await handleAnswer(data.answer);
            break;

          case 'disconnected':
            if (data.from !== userId & data.from === admin_id) {
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
        initiateCall(); // Start the call when media stream is ready
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
                  <path d="M12 4v16" />
                  <path d="M5 8v8m14-8v8" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v16" />
                </svg>
              )}
            </button>
            <button
              onClick={leaveRoom}
              className="p-4 rounded-full bg-red-500 text-white"
              title="Leave Room"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7v14" />
              </svg>
            </button>
          </div>
          <video id="remote-admin" autoPlay playsInline />
        </>
      ) : (
        <p>Access to the video room is restricted.</p>
      )}
    </div>
  );
};

export default NormalUserCallVideoRoom;
