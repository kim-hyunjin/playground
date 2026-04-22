package com.github.kimhyunjin.youtube

import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.constraintlayout.motion.widget.MotionLayout
import androidx.recyclerview.widget.LinearLayoutManager
import com.github.kimhyunjin.youtube.databinding.ActivityMainBinding
import com.github.kimhyunjin.youtube.player.PlayerHeader
import com.github.kimhyunjin.youtube.player.PlayerVideoAdapter
import com.google.android.exoplayer2.ExoPlayer
import com.google.android.exoplayer2.MediaItem
import com.google.android.exoplayer2.Player

class MainActivity : AppCompatActivity() {

    private val binding: ActivityMainBinding by lazy {
        ActivityMainBinding.inflate(layoutInflater)
    }

    private val videoList: VideoList by lazy {
        readData("video.json", VideoList::class.java) ?: VideoList(emptyList())
    }

    private var player: ExoPlayer? = null

    private lateinit var videoAdapter: VideoAdapter
    private lateinit var playerVideoAdapter: PlayerVideoAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        initMotionLayout()
        initVideoRecyclerView()
        initVideoPlayerRecyclerView()
        initControlButton()

        Log.i("videos", videoList.videos.toString())
        videoAdapter.submitList(videoList.videos)
    }


    private fun initControlButton() {
        binding.controlButton.setOnClickListener {
            player?.let {
                if (it.isPlaying) {
                    it.pause()
                } else {
                    it.play()
                }
            }
        }

        binding.hideButton.setOnClickListener {
            binding.motionLayout.transitionToState(R.id.hide)
            player?.pause()
        }
    }

    private fun initVideoRecyclerView() {
        videoAdapter = VideoAdapter(context = this) { videoItem ->
            binding.motionLayout.setTransition(R.id.collapse, R.id.expand)
            binding.motionLayout.transitionToEnd()

            val headerModel = PlayerHeader(
                id = "H${videoItem.id}",
                title = videoItem.title,
                channelName = videoItem.channelName,
                channelThumb = videoItem.channelThumb,
                viewCount = videoItem.viewCount,
                dateText = videoItem.dateText
            )
            val list = listOf(headerModel) + videoList.videos.filter { it.id != videoItem.id }
                .map { it.transform() }
            playerVideoAdapter.submitList(list)

            play(videoItem.videoUrl, videoItem.title)
        }

        binding.videoListRecyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = videoAdapter
        }
    }

    private fun initVideoPlayerRecyclerView() {
        playerVideoAdapter = PlayerVideoAdapter(context = this) { playerVideo ->

            val headerModel = PlayerHeader(
                id = "H${playerVideo.id}",
                title = playerVideo.title,
                channelName = playerVideo.channelName,
                channelThumb = playerVideo.channelThumb,
                viewCount = playerVideo.viewCount,
                dateText = playerVideo.dateText
            )
            val list = listOf(headerModel) + videoList.videos.filter { it.id != playerVideo.id }
                .map { it.transform() }

            playerVideoAdapter.submitList(list) {
                // 목록 수정 뒤 영상 상세 정보 헤더로 포지션 초기화
                binding.playerRecyclerView.scrollToPosition(0)
            }
            play(playerVideo.videoUrl, playerVideo.title)
        }

        binding.playerRecyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = playerVideoAdapter
            itemAnimator = null // 아이템 재정렬 시 깜빡임 없애기 위해 설정
        }
    }

    private fun initMotionLayout() {
        binding.motionLayout.targetView = binding.videoPlayerContainer
        // 처음엔 hide상태로 시작
        binding.motionLayout.jumpToState(R.id.hide)
        binding.motionLayout.setTransitionListener(object : MotionLayout.TransitionListener {
            override fun onTransitionStarted(
                motionLayout: MotionLayout?,
                startId: Int,
                endId: Int
            ) {

            }

            override fun onTransitionChange(
                motionLayout: MotionLayout?,
                startId: Int,
                endId: Int,
                progress: Float
            ) {
                binding.playerView.useController = false
            }

            // 확장된 상태에서만 player 컨트롤러 사용하기
            override fun onTransitionCompleted(motionLayout: MotionLayout?, currentId: Int) {
                binding.playerView.useController = currentId == R.id.expand
            }

            override fun onTransitionTrigger(
                motionLayout: MotionLayout?,
                triggerId: Int,
                positive: Boolean,
                progress: Float
            ) {
            }

        })
    }

    private fun initExoPlayer() {
        player = ExoPlayer.Builder(this).build().also {
            binding.playerView.player = it
            binding.playerView.useController = false
            it.addListener(object : Player.Listener {
                // player 상태에 따라 컨트롤 버튼 아이콘 바꾸기
                override fun onIsPlayingChanged(isPlaying: Boolean) {
                    super.onIsPlayingChanged(isPlaying)
                    if (isPlaying) {
                        binding.controlButton.setImageResource(R.drawable.ic_baseline_pause_24)
                    } else {
                        binding.controlButton.setImageResource(R.drawable.ic_baseline_play_arrow_24)
                    }
                }
            })
        }
    }

    private fun play(videoUrl: String, videoTitle: String) {
        player?.setMediaItem(MediaItem.fromUri(Uri.parse(videoUrl)))
        player?.prepare()
        player?.play()

        binding.videoTitleTextView.text = videoTitle
    }


    override fun onStart() {
        super.onStart()

        if (player == null) {
            initExoPlayer()
        }
    }

    override fun onStop() {
        super.onStop()
        player?.pause()
    }

    override fun onResume() {
        super.onResume()
        if (player == null) {
            initExoPlayer()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        player?.release()
    }
}