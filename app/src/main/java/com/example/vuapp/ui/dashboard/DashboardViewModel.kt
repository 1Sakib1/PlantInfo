package com.example.vuapp.ui.dashboard

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.vuapp.data.model.DashboardResponse
import com.example.vuapp.data.repository.DashboardRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val repository: DashboardRepository
) : ViewModel() {

    // Now each entity is a Map<String, Any?>
    val entities = MutableLiveData<List<Map<String, Any?>>>()
    val error = MutableLiveData<String?>()

    fun loadDashboard(keypass: String) {
        viewModelScope.launch {
            try {
                val response = repository.getDashboardData(keypass)
                if (response.isSuccessful) {
                    // Even if the API returns null, default to an empty list
                    entities.postValue(response.body()?.entities ?: emptyList())
                } else {
                    error.postValue("Error: ${response.code()}")
                }
            } catch (e: Exception) {
                error.postValue("Failed: ${e.message}")
            }
        }
    }
}
