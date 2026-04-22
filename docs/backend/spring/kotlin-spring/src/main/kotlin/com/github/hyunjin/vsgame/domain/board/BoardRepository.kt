package com.github.hyunjin.vsgame.domain.board

import org.springframework.data.jpa.repository.JpaRepository

interface BoardRepository : JpaRepository<Board, Long>