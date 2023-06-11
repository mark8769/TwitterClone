from django.contrib.auth.models import AbstractUser
from django.db import models
# https://stackoverflow.com/questions/8609192/what-is-the-difference-between-null-true-and-blank-true-in-django


class User(AbstractUser):
    # We have username, email, hashed password.
    pass

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_posts")
    datetime = models.DateTimeField(auto_now_add=True)
    content = models.TextField()

    def __str__(self):
        s = f"User: {self.user}"
        s += f"time: {self.datetime}"

        return s
    
    def serialize(self):
        return {
            "id": self.id,
            "username": self.user.username,
            "user": self.user.id,
            "datetime": self.datetime,
            "content": self.content
        }

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    like_state = models.BooleanField(blank=True, null=True)

    def __str__(self):
        s = f"User: {self.user}"
        s += f"Post: {self.post}"

        return s

class Following(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    user_being_followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    follow_state = models.BooleanField(default=False)

    def __str__(self):
        s = f"User: {self.user}"
        s += f"Post: {self.user_being_followed}"
        s += f"Following: {self.follow_state}"

        return s
