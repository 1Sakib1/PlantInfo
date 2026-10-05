package com.sakib.plantinfo.data.repository

import com.sakib.plantinfo.data.api.AuthApiService
import com.sakib.plantinfo.data.api.AuthRequest
import javax.inject.Inject

class AuthRepository @Inject constructor(
    private val apiService: AuthApiService
) {
    suspend fun login(url: String, username: String, password: String) =
        apiService.login(url, AuthRequest(username, password))
}
