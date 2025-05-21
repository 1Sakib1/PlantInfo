package com.example.vuapp.ui.login

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.vuapp.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val repository: AuthRepository
) : ViewModel() {

    val loginResult = MutableLiveData<String?>()
    val errorMessage = MutableLiveData<String?>()

    fun login(username: String, password: String, location: String) {
        val endpoint = "/$location/auth"

        viewModelScope.launch {
            try {
                val response = repository.login(endpoint, username, password)
                if (response.isSuccessful) {
                    loginResult.postValue(response.body()?.keypass)
                } else {
                    errorMessage.postValue("Login failed: ${response.code()}")
                }
            } catch (e: Exception) {
                errorMessage.postValue("Error: ${e.message}")
            }
        }
    }
}
