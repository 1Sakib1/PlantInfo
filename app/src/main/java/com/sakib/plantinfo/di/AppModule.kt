package com.sakib.plantinfo.di

import com.sakib.plantinfo.data.api.AuthApiService
import com.sakib.plantinfo.utils.Constants
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton
import com.sakib.plantinfo.data.api.DashboardApiService



@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton

    fun provideRetrofit(): Retrofit =
        Retrofit.Builder()
            .baseUrl(Constants.BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

    @Provides
    @Singleton
    fun provideAuthApiService(retrofit: Retrofit): AuthApiService =
        retrofit.create(AuthApiService::class.java)
    @Provides
    @Singleton
    fun provideDashboardApiService(retrofit: Retrofit): DashboardApiService =
        retrofit.create(DashboardApiService::class.java)

}
