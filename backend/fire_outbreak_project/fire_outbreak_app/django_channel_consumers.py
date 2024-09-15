# # import json
# # from channels.generic.websocket import AsyncWebsocketConsumer

# # from ..account.custom_jwt_auth import CustomJWTAuthentication
# # from ..account.adminrolebanckendauthenticate import RoleBasedBackend

# # class VideoConsumer(AsyncWebsocketConsumer):

# #     # Users stored here temporarily
# #     USERS_CONNECTED = []

# #     async def connect(self):
# #         self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
# #         self.room_group_name = f"room_{self.room_name}"
# #         self.user_id = None
# #         self.user_role = None
        
# #         # Accept connection
# #         await self.accept()

# #     async def disconnect(self, close_code):
# #         # Notify others in the room about the disconnection
# #         if self.user_id:
# #             await self.channel_layer.group_send(
# #                 self.room_group_name,
# #                 {
# #                     "type": "disconnected",
# #                     "data": {"from": self.user_id},
# #                 },
# #             )

# #             # Remove user from USERS_CONNECTED
# #             user = self.find_user(self.user_id)
# #             if user:
# #                 self.USERS_CONNECTED.remove(user)
# #                 await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

# #     async def receive(self, text_data):
# #         data = json.loads(text_data)

# #         # Handle new user joining
# #         if data["type"] == "new_user_joined":
# #             jwt_authenticate = CustomJWTAuthentication()
# #             try:
# #                 token = data.get("token")
# #                 validated_token = jwt_authenticate.get_validated_token(token)
# #                 self.user_id = validated_token["user_id"]
# #                 self.user_role = validated_token["role"]  # Assume role is included in the token
# #             except Exception as e:
# #                 await self.close()
# #                 return
            
# #             self.USERS_CONNECTED.append(
# #                 {"user_id": self.user_id, "full_name": data["full_name"], "role": self.user_role}
# #             )
# #             data["users_connected"] = self.USERS_CONNECTED

# #             await self.channel_layer.group_send(
# #                 self.room_group_name,
# #                 {
# #                     "type": "new_user_joined",
# #                     "data": data,
# #                 },
# #             )

# #         # Handle WebRTC offer
# #         elif data["type"] == "sending_offer":
# #             offer_from = data["from"]
# #             offer_to = data["to"]
# #             offer_from_role = self.get_user_role(offer_from)
# #             offer_to_role = self.get_user_role(offer_to)

# #             if offer_from_role == "normal_user" and offer_to_role == "admin":
# #                 await self.channel_layer.group_send(
# #                     self.room_group_name,
# #                     {
# #                         "type": "sending_offer",
# #                         "data": data,
# #                     },
# #                 )
# #             else:
# #                 await self.send(
# #                     json.dumps(
# #                         {
# #                             "type": "error",
# #                             "message": "Invalid call attempt",
# #                         }
# #                     )
# #                 )

# #         # Handle WebRTC answer
# #         elif data["type"] == "sending_answer":
# #             answer_from = data["from"]
# #             answer_to = data["to"]
# #             answer_from_role = self.get_user_role(answer_from)
# #             answer_to_role = self.get_user_role(answer_to)

# #             if answer_from_role == "SuperUser Admins" and answer_to_role == "Other Admins":
# #                 await self.channel_layer.group_send(
# #                     self.room_group_name,
# #                     {
# #                         "type": "sending_answer",
# #                         "data": data,
# #                     },
# #                 )
# #             else:
# #                 await self.send(
# #                     json.dumps(
# #                         {
# #                             "type": "error",
# #                             "message": "Invalid answer attempt",
# #                         }
# #                     )
# #                 )

# #         # Handle ICE candidates
# #         elif data["type"] == "sending_candidate":
# #             candidate_from = data["from"]
# #             candidate_to = data["to"]
# #             candidate_from_role = self.get_user_role(candidate_from)
# #             candidate_to_role = self.get_user_role(candidate_to)

# #             if (candidate_from_role in ["Other Admins", "SuperUser Admins"] and 
# #                 candidate_to_role in ["Other Admins", "SuperUser Admins"]):
# #                 await self.channel_layer.group_send(
# #                     self.room_group_name,
# #                     {
# #                         "type": "sending_candidate",
# #                         "data": data,
# #                     },
# #                 )
# #             else:
# #                 await self.send(
# #                     json.dumps(
# #                         {
# #                             "type": "error",
# #                             "message": "Invalid candidate attempt",
# #                         }
# #                     )
# #                 )

# #         # Handle disconnection
# #         elif data["type"] == "disconnected":
# #             await self.channel_layer.group_send(
# #                 self.room_group_name,
# #                 {
# #                     "type": "disconnected",
# #                     "data": data,
# #                 },
# #             )

# #     # Send the 'new_user_joined' message to the WebSocket
# #     async def new_user_joined(self, event):
# #         data = event["data"]
# #         await self.send(
# #             json.dumps(
# #                 {
# #                     "type": "new_user_joined",
# #                     "from": data["from"],
# #                     "users_connected": data["users_connected"],
# #                 }
# #             )
# #         )

# #     # Send the 'sending_offer' message to the WebSocket
# #     async def sending_offer(self, event):
# #         data = event["data"]
# #         await self.send(
# #             json.dumps(
# #                 {
# #                     "type": "sending_offer",
# #                     "from": data["from"],
# #                     "to": data["to"],
# #                     "offer": data["offer"],
# #                 }
# #             )
# #         )

# #     # Send the 'sending_answer' message to the WebSocket
# #     async def sending_answer(self, event):
# #         data = event["data"]
# #         await self.send(
# #             json.dumps(
# #                 {
# #                     "type": "sending_answer",
# #                     "from": data["from"],
# #                     "to": data["to"],
# #                     "answer": data["answer"],
# #                 }
# #             )
# #         )

# #     # Send the 'sending_candidate' message to the WebSocket
# #     async def sending_candidate(self, event):
# #         data = event["data"]
# #         await self.send(
# #             json.dumps(
# #                 {
# #                     "type": "sending_candidate",
# #                     "from": data["from"],
# #                     "to": data["to"],
# #                     "candidate": data["candidate"],
# #                 }
# #             )
# #         )

# #     # Send the 'disconnected' message to the WebSocket
# #     async def disconnected(self, event):
# #         data = event["data"]
# #         await self.send(
# #             json.dumps(
# #                 {
# #                     "type": "disconnected",
# #                     "from": data["from"],
# #                 }
# #             )
# #         )

# #     # Helper method to find user by ID from USERS_CONNECTED
# #     def find_user(self, user_id):
# #         for user in self.USERS_CONNECTED:
# #             if user["user_id"] == user_id:
# #                 return user
# #         return None

# #     # Helper method to get user role from USERS_CONNECTED
# #     def get_user_role(self, user_id):
# #         user = self.find_user(user_id)
# #         return user["role"] if user else None


# # import json
# # from channels.generic.websocket import AsyncWebsocketConsumer
# # # from ..account.custom_jwt_auth import CustomJWTAuthentication
# # # from ..account.adminrolebanckendauthenticate import RoleBasedBackend

# # class VideoConsumer(AsyncWebsocketConsumer):

# #     # Users stored here temporarily
# #     USERS_CONNECTED = []

# #     async def connect(self):
# #         self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
# #         self.room_group_name = f"room_{self.room_name}"
        
# #         # Accept connection
# #         await self.accept()

# #     async def disconnect(self, close_code):
# #         # Notify others in the room about the disconnection
# #         if self.user_id:
# #             await self.channel_layer.group_send(
# #                 self.room_group_name,
# #                 {
# #                     "type": "disconnected",
# #                     "data": {"from": self.scope.get('user').id},
# #                 },
# #             )

# #             # Remove user from USERS_CONNECTED
# #             user = self.find_user(self.scope.get('user').id)
# #             if user:
# #                 self.USERS_CONNECTED.remove(user)
# #                 await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

# #     async def receive(self, text_data):
# #         data = json.loads(text_data)

# #         # Handle new user joining
# #         if data["type"] == "new_user_joined":
# #         #     jwt_authenticate = CustomJWTAuthentication()
# #         #     role_based_backend = RoleBasedBackend()

# #         #     try:
# #         #         token = data.get("token")
# #         #         validated_token = jwt_authenticate.get_validated_token(token)
# #         #         self.user_id = validated_token["user_id"]
# #         #         self.user_role = validated_token["role"]
# #         #     except Exception:
# #         #         # Fall back to role-based authentication
# #         #         try:
# #         #             user_credentials = role_based_backend.authenticate(self.scope, username=data.get("username"), password = data.get("password"))
# #         #             if user_credentials:
# #         #                 self.user_id = user_credentials[0].id
# #         #                 self.user_role = user_credentials[1]  # Assuming role is provided in the credentials
# #         #         except Exception as e:
# #         #             await self.close()
# #         #             return

# #         # Check if user is an admin
# #             if len(self.USERS_CONNECTED) >= 2:
# #                 await self.send(
# #                     json.dumps(
# #                         {
# #                             "type": "error",
# #                             "message": "Admin is currently on a call.Call later after few minutes",
# #                         }
# #                     )
# #                 )
# #                 await self.close()
# #                 return

# #             self.USERS_CONNECTED.append(
# #                 {"user_id": data["from"], "full_name": data["full_name"], "role": self.scope.get('user').role}
# #             )
# #             data["users_connected"] = self.USERS_CONNECTED

# #             await self.channel_layer.group_send(
# #                 self.room_group_name,
# #                 {
# #                     "type": "new_user_joined",
# #                     "data": data,
# #                 },
# #             )

# #         # Handle WebRTC offer
# #         elif data["type"] == "sending_offer":
# #             offer_from = data["from"]
# #             offer_to = data["to"]
# #             offer_from_role = self.get_user_role(offer_from)
# #             offer_to_role = self.get_user_role(offer_to)

# #             if offer_from_role == "Normal User" and (offer_to_role == "SuperUser Admins"or offer_to_role=="Other Admins"):
# #                 await self.channel_layer.group_send(
# #                     self.room_group_name,
# #                     {
# #                         "type": "sending_offer",
# #                         "data": data,
# #                     },
# #                 )
# #             else:
# #                 await self.send(
# #                     json.dumps(
# #                         {
# #                             "type": "error",
# #                             "message": "Invalid call attempt",
# #                         }
# #                     )
# #                 )

# #         # Handle WebRTC answer
# #         elif data["type"] == "sending_answer":
# #             answer_from = data["from"]
# #             answer_to = data["to"]
# #             answer_from_role = self.get_user_role(answer_from)
# #             answer_to_role = self.get_user_role(answer_to)

# #             if answer_from_role == ("SuperUser Admins" or answer_from_role =="Other Admins") and answer_to_role == "Other Admins":
# #                 await self.channel_layer.group_send(
# #                     self.room_group_name,
# #                     {
# #                         "type": "sending_answer",
# #                         "data": data,
# #                     },
# #                 )
# #             else:
# #                 await self.send(
# #                     json.dumps(
# #                         {
# #                             "type": "error",
# #                             "message": "Invalid answer attempt",
# #                         }
# #                     )
# #                 )

# #         # Handle ICE candidates
# #         elif data["type"] == "sending_candidate":
# #             candidate_from = data["from"]
# #             candidate_to = data["to"]
# #             candidate_from_role = self.get_user_role(candidate_from)
# #             candidate_to_role = self.get_user_role(candidate_to)

# #             if (candidate_from_role in ["Other Admins", "SuperUser Admins"] and 
# #                 candidate_to_role in ["Other Admins", "SuperUser Admins"]):
# #                 await self.channel_layer.group_send(
# #                     self.room_group_name,
# #                     {
# #                         "type": "sending_candidate",
# #                         "data": data,
# #                     },
# #                 )
# #             else:
# #                 await self.send(
# #                     json.dumps(
# #                         {
# #                             "type": "error",
# #                             "message": "Invalid candidate attempt",
# #                         }
# #                     )
# #                 )

# #         # Handle disconnection
# #         elif data["type"] == "disconnected":
# #             await self.channel_layer.group_send(
# #                 self.room_group_name,
# #                 {
# #                     "type": "disconnected",
# #                     "data": data,
# #                 },
# #             )

# #     # Send the 'new_user_joined' message to the WebSocket
# #     async def new_user_joined(self, event):
# #         data = event["data"]
# #         await self.send(
# #             json.dumps(
# #                 {
# #                     "type": "new_user_joined",
# #                     "from": data["from"],
# #                     "users_connected": data["users_connected"],
# #                 }
# #             )
# #         )

# #     # Send the 'sending_offer' message to the WebSocket
# #     async def sending_offer(self, event):
# #         data = event["data"]
# #         await self.send(
# #             json.dumps(
# #                 {
# #                     "type": "sending_offer",
# #                     "from": data["from"],
# #                     "to": data["to"],
# #                     "offer": data["offer"],
# #                 }
# #             )
# #         )

# #     # Send the 'sending_answer' message to the WebSocket
# #     async def sending_answer(self, event):
# #         data = event["data"]
# #         await self.send(
# #             json.dumps(
# #                 {
# #                     "type": "sending_answer",
# #                     "from": data["from"],
# #                     "to": data["to"],
# #                     "answer": data["answer"],
# #                 }
# #             )
# #         )

# #     # Send the 'sending_candidate' message to the WebSocket
# #     async def sending_candidate(self, event):
# #         data = event["data"]
# #         await self.send(
# #             json.dumps(
# #                 {
# #                     "type": "sending_candidate",
# #                     "from": data["from"],
# #                     "to": data["to"],
# #                     "candidate": data["candidate"],
# #                 }
# #             )
# #         )

# #     # Send the 'disconnected' message to the WebSocket
# #     async def disconnected(self, event):
# #         data = event["data"]
# #         await self.send(
# #             json.dumps(
# #                 {
# #                     "type": "disconnected",
# #                     "from": data["from"],
# #                 }
# #             )
# #         )

# #     # Helper method to find user by ID from USERS_CONNECTED
# #     def find_user(self, user_id):
# #         for user in self.USERS_CONNECTED:
# #             if user["user_id"] == user_id:
# #                 return user
# #         return None

# #     # Helper method to get user role from USERS_CONNECTED
# #     def get_user_role(self, user_id):
# #         user = self.find_user(user_id)
# #         return user["role"] if user else None


# import json
# import redis
# from channels.generic.websocket import AsyncWebsocketConsumer
# from django.conf import settings

# # Create a Redis client
# redis_client = redis.StrictRedis(
#     host=settings.REDIS_HOST, 
#     port=settings.REDIS_PORT, 
#     db=settings.REDIS_DB
# )

# class VideoConsumer(AsyncWebsocketConsumer):

#     async def connect(self):
#         self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
#         self.room_group_name = f"room_{self.room_name}"
#         self.user_id = self.scope.get('user').id

#         # Add the user to Redis channel mapping
#         redis_client.set(f"user_channel_{self.user_id}", self.channel_name)

#         # Accept connection
#         await self.accept()

#     async def disconnect(self, close_code):
#         # Notify others in the room about the disconnection
#         if self.user_id:
#             await self.channel_layer.group_send(
#                 self.room_group_name,
#                 {
#                     "type": "disconnected",
#                     "data": {"from": self.user_id},
#                 },
#             )

#             # Remove the user from Redis channel mapping
#             redis_client.delete(f"user_channel_{self.user_id}")

#             await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#     async def receive(self, text_data):
#         data = json.loads(text_data)

#         # Handle new user joining
#         if data["type"] == "new_user_joined":
#             self.USERS_CONNECTED.append(
#                 {"user_id": data["from"], "full_name": data["full_name"], "role": self.scope.get('user').role}
#             )
#             data["users_connected"] = self.USERS_CONNECTED

#             await self.channel_layer.group_send(
#                 self.room_group_name,
#                 {
#                     "type": "new_user_joined",
#                     "data": data,
#                 },
#             )

#         # Handle WebRTC offer
#         elif data["type"] == "sending_offer":
#             offer_from = data["from"]
#             offer_to = data["to"]
#             offer_from_role = await self.get_user_role(offer_from)
#             offer_to_role = await self.get_user_role(offer_to)

#             if offer_from_role == "Normal User" and (offer_to_role == "SuperUser Admins" or offer_to_role == "Other Admins"):
#                 recipient_channel = redis_client.get(f"user_channel_{offer_to}")
#                 if recipient_channel:
#                     await self.channel_layer.send(
#                         recipient_channel,
#                         {
#                             "type": "sending_offer",
#                             "data": data,
#                         }
#                     )
#                 else:
#                     await self.send(
#                         json.dumps(
#                             {
#                                 "type": "error",
#                                 "message": "Recipient is not connected",
#                             }
#                         )
#                     )
#             else:
#                 await self.send(
#                     json.dumps(
#                         {
#                             "type": "error",
#                             "message": "Invalid call attempt",
#                         }
#                     )
#                 )

#         # Handle WebRTC answer
#         elif data["type"] == "sending_answer":
#             answer_from = data["from"]
#             answer_to = data["to"]
#             answer_from_role = await self.get_user_role(answer_from)
#             answer_to_role = await self.get_user_role(answer_to)

#             if (answer_from_role in ["SuperUser Admins", "Other Admins"]) and answer_to_role == "Other Admins":
#                 recipient_channel = redis_client.get(f"user_channel_{answer_to}")
#                 if recipient_channel:
#                     await self.channel_layer.send(
#                         recipient_channel,
#                         {
#                             "type": "sending_answer",
#                             "data": data,
#                         }
#                     )
#                 else:
#                     await self.send(
#                         json.dumps(
#                             {
#                                 "type": "error",
#                                 "message": "Recipient is not connected",
#                             }
#                         )
#                     )
#             else:
#                 await self.send(
#                     json.dumps(
#                         {
#                             "type": "error",
#                             "message": "Invalid answer attempt",
#                         }
#                     )
#                 )

#         # Handle ICE candidates
#         elif data["type"] == "sending_candidate":
#             candidate_from = data["from"]
#             candidate_to = data["to"]
#             candidate_from_role = await self.get_user_role(candidate_from)
#             candidate_to_role = await self.get_user_role(candidate_to)

#             if (candidate_from_role in ["Other Admins", "SuperUser Admins"] and
#                 candidate_to_role in ["Other Admins", "SuperUser Admins"]):
#                 recipient_channel = redis_client.get(f"user_channel_{candidate_to}")
#                 if recipient_channel:
#                     await self.channel_layer.send(
#                         recipient_channel,
#                         {
#                             "type": "sending_candidate",
#                             "data": data,
#                         }
#                     )
#                 else:
#                     await self.send(
#                         json.dumps(
#                             {
#                                 "type": "error",
#                                 "message": "Recipient is not connected",
#                             }
#                         )
#                     )
#             else:
#                 await self.send(
#                     json.dumps(
#                         {
#                             "type": "error",
#                             "message": "Invalid candidate attempt",
#                         }
#                     )
#                 )

#         # Handle disconnection
#         elif data["type"] == "disconnected":
#             await self.channel_layer.group_send(
#                 self.room_group_name,
#                 {
#                     "type": "disconnected",
#                     "data": data,
#                 },
#             )

#     # Send the 'new_user_joined' message to the WebSocket
#     async def new_user_joined(self, event):
#         data = event["data"]
#         await self.send(
#             json.dumps(
#                 {
#                     "type": "new_user_joined",
#                     "from": data["from"],
#                     "users_connected": data["users_connected"],
#                 }
#             )
#         )

#     # Send the 'sending_offer' message to the WebSocket
#     async def sending_offer(self, event):
#         data = event["data"]
#         await self.send(
#             json.dumps(
#                 {
#                     "type": "sending_offer",
#                     "from": data["from"],
#                     "to": data["to"],
#                     "offer": data["offer"],
#                 }
#             )
#         )

#     # Send the 'sending_answer' message to the WebSocket
#     async def sending_answer(self, event):
#         data = event["data"]
#         await self.send(
#             json.dumps(
#                 {
#                     "type": "sending_answer",
#                     "from": data["from"],
#                     "to": data["to"],
#                     "answer": data["answer"],
#                 }
#             )
#         )

#     # Send the 'sending_candidate' message to the WebSocket
#     async def sending_candidate(self, event):
#         data = event["data"]
#         await self.send(
#             json.dumps(
#                 {
#                     "type": "sending_candidate",
#                     "from": data["from"],
#                     "to": data["to"],
#                     "candidate": data["candidate"],
#                 }
#             )
#         )

#     # Send the 'disconnected' message to the WebSocket
#     async def disconnected(self, event):
#         data = event["data"]
#         await self.send(
#             json.dumps(
#                 {
#                     "type": "disconnected",
#                     "from": data["from"],
#                 }
#             )
#         )

#     # Helper method to find user by ID from USERS_CONNECTED
#     def find_user(self, user_id):
#         for user in self.USERS_CONNECTED:
#             if user["user_id"] == user_id:
#                 return user
#         return None

#     # Helper method to get user role from USERS_CONNECTED
#     async def get_user_role(self, user_id):
#         user = self.find_user(user_id)
#         return user["role"] if user else None

import os
import json
import redis
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings

# Create a Redis client
redis_client = redis.StrictRedis(
    host=os.environ.get("CHANNEL_HOST"), 
    port=os.environ.get("CHANNEL_PORT"), 
    # db=settings.REDIS_DB
)

class VideoConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"room_{self.room_name}"
        self.user_id = self.scope.get('user').id

        # Initialize USERS_CONNECTED
        self.USERS_CONNECTED = []

        # Add the user to Redis channel mapping
        redis_client.set(f"user_channel_{self.user_id}", self.channel_name)

        # Accept connection
        await self.accept()

    async def disconnect(self, close_code):
        # Notify others in the room about the disconnection
        if self.user_id:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "disconnected",
                    "data": {
                        "from": self.user_id,
                        "full_name":self.scope.get('user').full_name
                        },
                },
            )

            # Remove the user from Redis channel mapping
            
            user = self.find_user(self.user_id)
            if user:
                self.USERS_CONNECTED.remove(user)
                redis_client.delete(f"user_channel_{self.user_id}")
                await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
                
    async def receive(self, text_data):
        data = json.loads(text_data)

        # Handle new user joining
        if data["type"] == "new_user_joined":
            self.USERS_CONNECTED.append(
                {"user_id": data["from"], "full_name": data["full_name"], "role": self.scope.get('user').role}
            )
            data["users_connected"] = self.USERS_CONNECTED

            # recipient_channel = redis_client.get(f"user_channel_{data['to']}")
            # if recipient_channel:
            #     await self.channel_layer.send(
            #         recipient_channel,
            #         {
            #             "type": "new_user_joined",
            #             "data": data,
            #         }
            #     )
            # else:
            #     await self.send(
            #         json.dumps(
            #             {
            #                 "type": "error",
            #                 "message": "Recipient is not connected",
            #             }
            #         )
            #     )
        

        # Handle WebRTC offer
        elif data["type"] == "sending_offer":
            offer_from = data["from"]
            offer_to = data["to"]
            offer_from_role = await self.get_user_role(offer_from)
            offer_to_role = await self.get_user_role(offer_to)

            if offer_from_role == "Normal User" and (offer_to_role == "SuperUser Admins" or offer_to_role == "Other Admins"):
                recipient_channel = redis_client.get(f"user_channel_{offer_to}")
                if recipient_channel:
                    await self.channel_layer.send(
                        recipient_channel,
                        {
                            "type": "sending_offer",
                            "data": data,
                        }
                    )
                else:
                    await self.send(
                        json.dumps(
                            {
                                "type": "error",
                                "message": "Recipient is not connected",
                            }
                        )
                    )
            else:
                await self.send(
                    json.dumps(
                        {
                            "type": "error",
                            "message": "Invalid call attempt",
                        }
                    )
                )

        # Handle WebRTC answer
        elif data["type"] == "sending_answer":
            answer_from = data["from"]
            answer_to = data["to"]
            answer_from_role = await self.get_user_role(answer_from)
            answer_to_role = await self.get_user_role(answer_to)

            if (answer_from_role in ["SuperUser Admins", "Other Admins"]) and answer_to_role == "Other Admins":
                recipient_channel = redis_client.get(f"user_channel_{answer_to}")
                if recipient_channel:
                    await self.channel_layer.send(
                        recipient_channel,
                        {
                            "type": "sending_answer",
                            "data": data,
                        }
                    )
                else:
                    await self.send(
                        json.dumps(
                            {
                                "type": "error",
                                "message": "Recipient is not connected",
                            }
                        )
                    )
            else:
                await self.send(
                    json.dumps(
                        {
                            "type": "error",
                            "message": "Invalid answer attempt",
                        }
                    )
                )

        # Handle ICE candidates
        elif data["type"] == "sending_candidate":
            candidate_from = data["from"]
            candidate_to = data["to"]
            candidate_from_role = await self.get_user_role(candidate_from)
            candidate_to_role = await self.get_user_role(candidate_to)

            if (candidate_from_role in ["Other Admins", "SuperUser Admins"] and
                candidate_to_role in ["Other Admins", "SuperUser Admins"]):
                recipient_channel = redis_client.get(f"user_channel_{candidate_to}")
                if recipient_channel:
                    await self.channel_layer.send(
                        recipient_channel,
                        {
                            "type": "sending_candidate",
                            "data": data,
                        }
                    )
                else:
                    await self.send(
                        json.dumps(
                            {
                                "type": "error",
                                "message": "Recipient is not connected",
                            }
                        )
                    )
            else:
                await self.send(
                    json.dumps(
                        {
                            "type": "error",
                            "message": "Invalid candidate attempt",
                        }
                    )
                )

        # Handle disconnection
        elif data["type"] == "disconnected":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "disconnected",
                    "data": data,
                },
            )
    # Send the 'new_user_joined' message to the WebSocket
    async def new_user_joined(self, event):
        data = event["data"]
        await self.send(
            json.dumps(
                {
                    "type": "new_user_joined",
                    "to":data["to"],
                    "from": data["from"],
                    "users_connected": data["users_connected"],
                }
            )
        )

    # Send the 'sending_offer' message to the WebSocket
    async def sending_offer(self, event):
        data = event["data"]
        await self.send(
            json.dumps(
                {
                    "type": "sending_offer",
                    "from": data["from"],
                    "to": data["to"],
                    "offer": data["offer"],
                }
            )
        )

    # Send the 'sending_answer' message to the WebSocket
    async def sending_answer(self, event):
        data = event["data"]
        await self.send(
            json.dumps(
                {
                    "type": "sending_answer",
                    "from": data["from"],
                    "to": data["to"],
                    "answer": data["answer"],
                }
            )
        )

    # Send the 'sending_candidate' message to the WebSocket
    async def sending_candidate(self, event):
        data = event["data"]
        await self.send(
            json.dumps(
                {
                    "type": "sending_candidate",
                    "from": data["from"],
                    "to": data["to"],
                    "candidate": data["candidate"],
                }
            )
        )



    # Helper method to find user by ID from USERS_CONNECTED
    def find_user(self, user_id):
        for user in self.USERS_CONNECTED:
            if user["user_id"] == user_id:
                return user
        return None

    # Helper method to get user role from USERS_CONNECTED
    async def get_user_role(self, user_id):
        user = self.find_user(user_id)
        return user["role"] if user else None
