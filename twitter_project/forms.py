from django import forms


class InputURLForm(forms.Form):
    input_url = forms.URLField()
