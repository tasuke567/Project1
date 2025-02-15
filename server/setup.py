from setuptools import setup, find_packages

setup(
    name="server",
    version="1.0",
    packages=find_packages(),
    install_requires=[
        'flask',
        'scikit-learn',
        'pandas',
        'joblib',
        'flask-cors'
    ]
) 