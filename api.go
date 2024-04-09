// SPDX-FileCopyrightText: 2023 The Pion community <https://pion.ly>
// SPDX-License-Identifier: MIT

// Package signal contains helpers to exchange the SDP session
// description between examples.
package main

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"log"
	"net/http"
)

func ApiSDP(w http.ResponseWriter, r *http.Request) {
	body, _ := io.ReadAll(r.Body)
	log.Println("Recibido SDP remoto")
	gloRemoteSDP <- string(body)

	w.Write([]byte(<-gloLocalSDP))
	log.Println("Enviado SDP local")

}

func ApiRestart(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(`{"Status": "OK"}`))
	log.Fatal("ApiRestart")
}

// Encode encodes the input in base64
func Encode(obj interface{}) string {
	b, err := json.Marshal(obj)
	if err != nil {
		panic(err)
	}

	return base64.StdEncoding.EncodeToString(b)
}

// Decode decodes the input from base64
func Decode(in string, obj interface{}) {
	b, err := base64.StdEncoding.DecodeString(in)
	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(b, obj)
	if err != nil {
		panic(err)
	}
}
