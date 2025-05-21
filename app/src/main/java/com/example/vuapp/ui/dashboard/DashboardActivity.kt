package com.example.vuapp.ui.dashboard

import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.vuapp.databinding.ActivityDashboardBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding
    private val viewModel: DashboardViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val keypass = intent.getStringExtra("keypass") ?: "unknown"
        binding.topicTitle.text = "Topic: $keypass"

        viewModel.loadDashboard(keypass)
        binding.entityRecyclerView.layoutManager = LinearLayoutManager(this)

        viewModel.entities.observe(this) { list ->
            if (list.isEmpty()) {
                Toast.makeText(this, "No entities found for $keypass", Toast.LENGTH_LONG).show()
            }
            binding.entityRecyclerView.adapter = EntityAdapter(list)
        }

        viewModel.error.observe(this) { error ->
            error?.let {
                Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
            }
        }
    }
}
