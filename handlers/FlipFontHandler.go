package handlers

import (
	"io"
	"log"
	"net/http"
	"os/exec"
	"path/filepath"
	"strings"
)

func FlipFontHandler(writer http.ResponseWriter, request *http.Request) {
	input, header, err := request.FormFile("font")
	if err != nil {
		log.Print("failed to parse multipart form: ", err)
		http.Error(writer, "invalid multipart form", http.StatusBadRequest)
		return
	}
	defer input.Close()

	cmd := exec.Command("python3", "font.py")
	stdin, err := cmd.StdinPipe()
	if err != nil {
		log.Print("failed to open stdin pipe: ", err)
		http.Error(writer, "unexpected internal server error", http.StatusInternalServerError)
		return
	}

	go func() {
		defer stdin.Close()
		_, err := io.Copy(stdin, input)
		if err != nil {
			log.Print("failed to write to stdin: ", err)
		}
	}()

	output, err := cmd.Output()
	if err != nil {
		log.Print("failed to flip font: ", err)
		http.Error(writer, "internal server error while flipping font", http.StatusInternalServerError)
		return
	}

	fileExt := filepath.Ext(header.Filename)
	fileNewName := reverse(strings.TrimSuffix(header.Filename, fileExt)) + fileExt

	writer.Header().Set("Content-Type", "font/ttf")
	writer.Header().Set("Content-Disposition", "attachment; filename="+fileNewName)
	writer.Write(output)
}

func reverse(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}
