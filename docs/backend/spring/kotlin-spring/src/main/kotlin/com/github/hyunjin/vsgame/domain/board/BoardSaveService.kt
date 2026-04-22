package com.github.hyunjin.vsgame.domain.board

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class BoardSaveService(
    private val boardRepository: BoardRepository,
    private val boardFindService: BoardFindService
) {
    fun save(dto: BoardSaveRequest): Board {
        return if (dto.id == null) {
            boardRepository.save(dto.toEntity())
        } else {
            val newContents = dto.contents.map { Content(description = it.description, photo_url = it.photo_url) }
            boardFindService.findById(dto.id).apply {
                this.title = dto.title
                this.writer = dto.writer
                this.description = dto.description
                this.setContents(newContents as MutableList<Content>)
            }
        }
    }
}
