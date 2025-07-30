package handlers

import (
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func ConvertDocxHandler(writer http.ResponseWriter, request *http.Request) {
	input, header, err := request.FormFile("file")
	if err != nil {
		log.Print("failed to parse multipart form: ", err)
		http.Error(writer, "invalid multipart form", http.StatusBadRequest)
		return
	}
	defer input.Close()

	// Save the uploaded .docx to a temp file
	tempDir := "/tmp"
	inputPath := filepath.Join(tempDir, header.Filename)
	outputPath := strings.TrimSuffix(inputPath, filepath.Ext(inputPath)) + ".pdf"

	fileBytes, err := io.ReadAll(input)
	if err != nil {
		log.Print("failed to read input file: ", err)
		http.Error(writer, "failed to read uploaded file", http.StatusInternalServerError)
		return
	}

	err = os.WriteFile(inputPath, fileBytes, 0644)
	if err != nil {
		log.Print("failed to write temp input file: ", err)
		http.Error(writer, "failed to save uploaded file", http.StatusInternalServerError)
		return
	}

	// Convert to PDF using LibreOffice
	cmd := exec.Command("libreoffice", "--headless", "--convert-to", "pdf", "--outdir", tempDir, inputPath)
	err = cmd.Run()
	if err != nil {
		log.Printf("failed to convert .docx to .pdf: %v", err)
		http.Error(writer, "failed to convert to pdf", http.StatusInternalServerError)
		return
	}

	outputBytes, err := os.ReadFile(outputPath)
	if err != nil {
		log.Print("failed to read converted PDF: ", err)
		http.Error(writer, "failed to read converted pdf", http.StatusInternalServerError)
		return
	}

	// Clean up
	defer func() {
		_ = os.Remove(inputPath)
		_ = os.Remove(outputPath)
	}()

	// Send response
	writer.Header().Set("Content-Type", "application/pdf")
	writer.Header().Set("Content-Disposition", "attachment; filename="+strings.TrimSuffix(header.Filename, filepath.Ext(header.Filename))+".pdf")
	writer.Write(outputBytes)
}
