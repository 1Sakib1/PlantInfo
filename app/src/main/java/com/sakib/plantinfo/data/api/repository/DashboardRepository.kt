package com.sakib.plantinfo.data.repository

import com.sakib.plantinfo.data.api.DashboardApiService
import javax.inject.Inject

class DashboardRepository @Inject constructor(
    private val api: DashboardApiService
) {
    suspend fun getDashboardData(keypass: String) =
        api.getDashboardData(keypass)
}
