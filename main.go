package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/ldobbelsteen/adrege-spiegelschrift/handlers"
)

const ListeningPort = 1235

func main() {
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir("web/dist")))
	mux.HandleFunc("/api/flip-font", handlers.FlipFontHandler)
	mux.HandleFunc("/api/convert-docx", handlers.ConvertDocxHandler)

	log.Print("started listening on port ", ListeningPort, "...")
	err := http.ListenAndServe(":"+strconv.Itoa(ListeningPort), mux)
	if err != nil {
		log.Print("failed to serve web and api: ", err)
	}
}
