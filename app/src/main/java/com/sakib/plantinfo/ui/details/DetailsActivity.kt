package com.sakib.plantinfo.ui.details

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.sakib.plantinfo.databinding.ActivityDetailsBinding
import com.sakib.plantinfo.ui.login.LoginActivity

class DetailsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDetailsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDetailsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // ✅ Set custom toolbar as ActionBar
        setSupportActionBar(binding.topAppBar)

        // ✅ Enable back button in the AppBar
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Details"

        // 🔙 Handle back arrow click
        binding.topAppBar.setNavigationOnClickListener {
            finish() // Go back to Dashboard
            overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right)
        }

        // ✅ Dynamically add entity details
        val container = binding.detailsContainer
        intent.extras?.keySet()?.forEach { key ->
            val value = intent.getStringExtra(key) ?: "N/A"
            val textView = TextView(this).apply {
                text = "$key: $value"
                textSize = 16f
                setPadding(0, 12, 0, 12)
            }
            container.addView(textView)
        }

        // ✅ Logout button
        binding.logoutButton.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
        }
    }

    // ✅ Handle system back arrow in toolbar
    override fun onSupportNavigateUp(): Boolean {
        onBackPressedDispatcher.onBackPressed()
        return true
    }
}
