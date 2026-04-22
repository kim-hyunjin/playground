package com.example.happyplaces.adapters

import android.net.Uri
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.happyplaces.databinding.ItemHappyPlaceBinding
import com.example.happyplaces.models.PlaceEntity

class HappyPlaceAdapter(private val places: List<PlaceEntity>, private val onClickPlace: (position: Int, place: PlaceEntity) -> Unit):RecyclerView.Adapter<HappyPlaceAdapter.ViewHolder>() {

    class ViewHolder(binding: ItemHappyPlaceBinding): RecyclerView.ViewHolder(binding.root) {
        val image = binding.ivPlaceImage
        val title = binding.tvTitle
        val description = binding.tvDescription
    }

    fun getData(): List<PlaceEntity> {
        return places
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(ItemHappyPlaceBinding.inflate(LayoutInflater.from(parent.context), parent, false))
    }

    override fun getItemCount(): Int {
        return places.size
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val place = places[position]
        holder.image.setImageURI(Uri.parse(place.image))
        holder.title.text = place.title
        holder.description.text = place.description
        holder.itemView.setOnClickListener {
            onClickPlace(position, place)
        }
    }
}