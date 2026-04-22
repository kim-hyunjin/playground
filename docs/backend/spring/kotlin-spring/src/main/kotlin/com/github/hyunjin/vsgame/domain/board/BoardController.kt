package com.github.hyunjin.vsgame.domain.board

import javassist.NotFoundException
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestBody

@Controller
@RequestMapping("/board")
class BoardController(
    private val boardFindService: BoardFindService,
    private val boardSaveService: BoardSaveService
) {

    @GetMapping
    fun getBoards(@PageableDefault(sort = ["id"], direction = Sort.Direction.DESC) pageable: Pageable): ResponseEntity<Page<Board>> {
        val boards = boardFindService.findPageable(pageable)
        return ResponseEntity(boards, HttpStatus.OK)
    }

    @GetMapping("/{id}")
    fun getBoard(@PathVariable id: Long): ResponseEntity<Any> {
        return try {
            ResponseEntity(boardFindService.findById(id), HttpStatus.OK)
        } catch (e: NotFoundException) {
            ResponseEntity(e.message, HttpStatus.BAD_REQUEST)
        }
    }

    @RequestMapping(method = [RequestMethod.POST, RequestMethod.PUT])
    fun saveBoard(@RequestBody dto: BoardSaveRequest): ResponseEntity<Board> {
        return ResponseEntity(boardSaveService.save(dto), HttpStatus.CREATED)
    }
}