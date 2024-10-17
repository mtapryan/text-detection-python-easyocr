package main

import (
    "encoding/json"
    "net/http"
)

type LoginRequest struct {
    Username string `json:"username"`
    Password string `json:"password"`
}

type LoginResponse struct {
    Success bool `json:"success"`
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
    var req LoginRequest
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    if req.Username == "admin" && req.Password == "123456" {
        json.NewEncoder(w).Encode(LoginResponse{Success: true})
    } else {
        json.NewEncoder(w).Encode(LoginResponse{Success: false})
    }
}

func main() {
    http.HandleFunc("/login", loginHandler)
    http.ListenAndServe(":8080", nil)
}