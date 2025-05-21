package com.example.vuapp.data.api

import com.example.vuapp.data.model.DashboardResponse
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path

interface DashboardApiService {
    @GET("dashboard/{keypass}")
    suspend fun getDashboardData(@Path("keypass") keypass: String): Response<DashboardResponse>
}
