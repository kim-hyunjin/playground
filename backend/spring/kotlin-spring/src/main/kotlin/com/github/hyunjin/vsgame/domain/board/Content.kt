package com.github.hyunjin.vsgame.domain.board

import com.fasterxml.jackson.annotation.JsonIgnore
import javax.persistence.Entity
import javax.persistence.SequenceGenerator
import javax.persistence.Column
import javax.persistence.Id
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.ManyToOne
import javax.persistence.JoinColumn

@Entity
@SequenceGenerator(
    name = "CONTENT_SEQ_GENERATOR",
    sequenceName = "CONTENT_SEQ",
    initialValue = 1, allocationSize = 50
)
class Content(
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "CONTENT_SEQ_GENERATOR")
    @Column(name = "CONTENT_ID")
    val id: Long = 0L,

    @Column(nullable = false)
    var description: String,

    var photo_url: String?,
) {
    @ManyToOne
    @JoinColumn(name = "BOARD_ID")
    @JsonIgnore
    lateinit var board: Board
}
