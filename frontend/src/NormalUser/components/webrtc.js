// src/webrtc.js

// export const createPeerConnection = (localStream, remoteStreamRef, onIceCandidate) => {
//     const pc = new RTCPeerConnection({
//       iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
//     });
  
//     localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  
//     pc.ontrack = event => {
//       const [remoteStream] = event.streams;
//       if (remoteStreamRef.current) {
//         remoteStreamRef.current.srcObject = remoteStream;
//       }
//     };
  
//     pc.onicecandidate = event => {
//       if (event.candidate && onIceCandidate) {
//         onIceCandidate(event.candidate);
//       }
//     };
  
//     return pc;
//   };
  
//   export const createOffer = async (pc) => {
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     return offer.sdp;
//   };
  
//   export const createAnswer = async (pc) => {
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);
//     return answer.sdp;
//   };
  
//   export const setRemoteDescription = async (pc, sdp, type) => {
//     const description = new RTCSessionDescription({ type, sdp });
//     await pc.setRemoteDescription(description);
//   };
  