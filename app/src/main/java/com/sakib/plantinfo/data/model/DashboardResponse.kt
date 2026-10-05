package com.sakib.plantinfo.data.model

data class DashboardResponse(
    val entities: List<Map<String, Any?>>,
    val entityTotal: Int
)
