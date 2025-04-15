from django import forms

class StatementForm(forms.Form):
    statement = forms.CharField(label='Enter your statement', max_length=500)