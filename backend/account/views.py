from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer

# 1. Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,) # Anyone can register
    serializer_class = RegisterSerializer

# 2. Profile View (Protected)
class ProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated] # MUST be logged in
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
