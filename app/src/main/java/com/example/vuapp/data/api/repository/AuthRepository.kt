package com.example.vuapp.data.repository

import com.example.vuapp.data.api.AuthApiService
import com.example.vuapp.data.api.AuthRequest
import javax.inject.Inject

class AuthRepository @Inject constructor(
    private val apiService: AuthApiService
) {
    suspend fun login(url: String, username: String, password: String) =
        apiService.login(url, AuthRequest(username, password))
}
