package com.example.vuapp.data.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Url

// Request Body
data class AuthRequest(
    val username: String,
    val password: String
)

// Response Body
data class AuthResponse(
    val keypass: String
)

interface AuthApiService {
    @POST
    suspend fun login(
        @Url url: String,
        @Body request: AuthRequest
    ): Response<AuthResponse>
}
