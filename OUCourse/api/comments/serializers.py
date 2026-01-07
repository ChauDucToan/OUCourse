from rest_framework import serializers
from .models import Comment, Emotion
from ..users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['user'] = UserSerializer(instance.user).data

        return data

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_date', 'user', 'lesson']
        extra_kwargs = {
            'lesson': {
                'write_only': "True"
            }
        }

class EmotionSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'type', 'user']
        read_only_fields = ['user']

    def validate_type(self, value):
        valid_types = [choice[0] for choice in Emotion.EmotionType.choices]
        if value not in valid_types:
            raise serializers.ValidationError("Invalid emotion type.")
        return value
    
    def create(self, validated_data):
        user = validated_data['user']
        content_type = validated_data['content_type']
        object_id = validated_data['object_id']
        type_val = validated_data['type']

        emotion, created = Emotion.objects.update_or_create(
            user=user,
            content_type=content_type,
            object_id=object_id,
            defaults={'type': type_val}
        )
        return emotion