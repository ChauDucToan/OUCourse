pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate

# EXPORT ENV_VARIABLE = ...
# Chèn data mẫu
# python manage.py shell  <<EOF
# EOF

# Chạy server
python manage.py runserver