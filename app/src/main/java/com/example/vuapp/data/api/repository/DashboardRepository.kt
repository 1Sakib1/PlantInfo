package com.example.vuapp.data.repository

import com.example.vuapp.data.api.DashboardApiService
import javax.inject.Inject

class DashboardRepository @Inject constructor(
    private val api: DashboardApiService
) {
    suspend fun getDashboardData(keypass: String) =
        api.getDashboardData(keypass)
}
