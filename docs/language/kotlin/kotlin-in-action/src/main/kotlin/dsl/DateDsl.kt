package dsl

import java.time.Duration
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.Period

val Int.hours: Duration
    get() = Duration.ofHours(toLong())
val Int.days: Period
    get() = Period.ofDays(this) // this는 상수의 값을 가리킨다.

val Duration.ago: LocalDateTime
    get() =  baseTime() - this
val Duration.fromNow: LocalDateTime
    get() =  baseTime() + this

val Period.ago: LocalDate
    get() = baseDate() - this // LocalDate.minus 호출
val Period.fromNow: LocalDate
    get() = baseDate() + this // LocalDate.plus 호출

object ago
object fromNow

infix fun Int.hours(fromNow: fromNow) = baseTime().plusHours(toLong())
infix fun Int.hours(ago: ago) = baseTime().minusHours(toLong())
infix fun Int.days(fromNow: fromNow) = baseDate().plusDays(toLong())
infix fun Int.days(ago: ago) = baseDate().minusDays(toLong())

private fun baseDate() = LocalDate.now()
private fun baseTime() = LocalDateTime.now()

fun main() {
    println(1.days.ago)
    println(1 days ago)

    println(1.days.fromNow)
    println(1 days fromNow)

    println(1.hours.ago)
    println(1 hours ago)

    println(1.hours.fromNow)
    println(1 hours fromNow)
}