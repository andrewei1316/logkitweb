
function parseJSON (response) {
  return response.json()
}

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    return response
  }
}

export default function request (url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      if (data.code === 'L200') {
        return data
      } else {
        this.$Notice.error({title: '失败', desc: data.message})
        return data
      }
    })
    .catch(err => {
      this.$Notice.error({title: '失败', desc: err})
    })
}
