package com.example.vuapp.ui.login

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import android.content.Intent
import com.example.vuapp.ui.dashboard.DashboardActivity

import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.vuapp.databinding.ActivityLoginBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private val viewModel: LoginViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        Toast.makeText(this, "Login Screen Ready ✅", Toast.LENGTH_SHORT).show()

        binding.loginButton.setOnClickListener {
            val username = binding.usernameEditText.text.toString().trim()
            val password = binding.passwordEditText.text.toString().trim()
            val location = "sydney"  // use "footscray" or "ort" if needed

            viewModel.login(username, password, location)
        }

        viewModel.loginResult.observe(this) { keypass ->
            keypass?.let {
                val intent = Intent(this, DashboardActivity::class.java)
                intent.putExtra("keypass", it)  // ✅ Send their unique keypass
                startActivity(intent)
                finish()
            }
        }


        viewModel.errorMessage.observe(this) { error ->
            error?.let {
                Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
                Log.e("LOGIN_ERROR", it)
            }
        }
    }
}
