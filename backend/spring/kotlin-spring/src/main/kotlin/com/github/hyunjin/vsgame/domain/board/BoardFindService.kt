package com.github.hyunjin.vsgame.domain.board

import javassist.NotFoundException
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class BoardFindService(
    private val boardRepository: BoardRepository
) {

    fun findById(boardId: Long): Board = boardRepository.findById(boardId).orElseThrow {
        throw NotFoundException("'$boardId'번 아이디의 게시글이 존재하지 않습니다.")
    }

    fun findPageable(pageable: Pageable): Page<Board> {
        return boardRepository.findAll(pageable)
    }
}