const log = msg => {
  document.getElementById('logs').innerHTML += msg + '<br>'
}

window.createSession = isPublisher => {
  const pc = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  })

  pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)

  pc.onicecandidate = event => {
    console.log(event)
  }

  if (isPublisher) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        stream.getTracks().forEach(track => pc.addTrack(track, stream))
        document.getElementById('video1').srcObject = stream
        pc.createOffer()
          .then(d => pc.setLocalDescription(d))
          .catch(log)
      }).catch(log)
  } else {
    pc.addTransceiver('video')
    pc.createOffer()
      .then(d => pc.setLocalDescription(d))
      .catch(log)

    pc.ontrack = function (event) {
      const el = document.getElementById('video1')
      el.srcObject = event.streams[0]
      el.autoplay = true
      el.controls = true
    }
  }

  window.startSession = () => {

    fetch('./SDP', {
      method: "POST",
      body: btoa(JSON.stringify(pc.localDescription)),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then(response => response.text())
      .then(text => {
        aux = text
        console.log(aux)
        try {
          pc.setRemoteDescription(JSON.parse(atob(aux)))
        } catch (e) {
          alert(e)
        }
      })
      .catch(err => console.log('ERR', err)); // Capturar errores

  }

  window.restartServer = () => {
    // Solicitud GET (Request).
    fetch('./Restart')
      // Exito
      .then(response => response.json())  // convertir a json
      .then(json => console.log(json))    //imprimir los datos en la consola
      .catch(err => console.log('ERR', err)); // Capturar errores
  }
}
