package com.github.hyunjin.vsgame.domain.board

data class BoardSaveRequest(
    val id: Long?,
    val title: String,
    val writer: String?,
    val thumbnail: String?,
    val description: String?,
    val contents: List<ContentSaveRequest>
) {
    fun toEntity(): Board {
        val board = Board(
            id = id ?: 0L,
            title = title,
            writer = writer,
            thumbnail = thumbnail,
            description = description,
        )
        board.setContents(contents.map { Content(description = it.description, photo_url = it.photo_url) } as MutableList<Content>)
        return board
    }
}

data class ContentSaveRequest(
    val description: String,
    val photo_url: String?
)