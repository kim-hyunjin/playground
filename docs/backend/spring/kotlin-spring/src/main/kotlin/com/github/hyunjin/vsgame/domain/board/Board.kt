package com.github.hyunjin.vsgame.domain.board

import com.fasterxml.jackson.annotation.JsonIgnore
import org.hibernate.annotations.BatchSize
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.SequenceGenerator
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.OneToMany
import javax.persistence.FetchType
import javax.persistence.CascadeType


@Entity
@SequenceGenerator(
    name = "BOARD_SEQ_GENERATOR",
    sequenceName = "BOARD_SEQ",
    initialValue = 1, allocationSize = 50
)
class Board(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BOARD_SEQ_GENERATOR")
    @Column(name = "BOARD_ID")
    val id: Long = 0L,

    @Column(nullable = false)
    var title: String,

    var thumbnail: String?,

    var writer: String?,

    var description: String?
) {
    @OneToMany(mappedBy = "board", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    @JsonIgnore
    @BatchSize(size = 20)
    private var _contents: MutableList <Content> = mutableListOf()
    val contents: List<Content>
        get() = _contents

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    lateinit var createdAt: LocalDateTime
        protected set

    fun setContents(contents: MutableList<Content>) {
        this._contents = contents
        for (c in contents) {
            c.board = this
        }
    }
}
