<p align="center">
  <a href="https://hancecybersecurity.com/" target="blank"><img src="https://hancecybersecurity.com/assets/img/hance1-logo.png" width="200" alt="Nest Logo" /></a>
</p>

  <p align="center"><a href="@">HanceCS</a> SuperApp backend.</p>

## Description
The entire backend for the hancecs app.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Guides

### Uploading files
To upload files:

With JS:
```js
const fileInput = document.querySelector('input[type="file"]'); // Assuming there's a file input in your HTML
const baseUrl = 'BASE_URL/attendance/attachment';
const token = 'TOKEN';

fileInput.addEventListener('change', () => {
  const formData = new FormData();
  const file = fileInput.files[0]; // Get the first selected file
  
  formData.append('file', file);

  fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
});

```

With Curl:
```bash
curl -X POST -F "file=@./confs/flake.nix" BASE_URL/attendance/attachment -H 'Authorization:Bearer TOKEN'
```


### Getting files
All files exist at `BASE_URL/file/[filename]`.