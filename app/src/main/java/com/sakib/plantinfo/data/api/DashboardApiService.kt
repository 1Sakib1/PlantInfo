package com.sakib.plantinfo.data.api

import com.sakib.plantinfo.data.model.DashboardResponse
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path

interface DashboardApiService {
    @GET("dashboard/{keypass}")
    suspend fun getDashboardData(@Path("keypass") keypass: String): Response<DashboardResponse>
}
