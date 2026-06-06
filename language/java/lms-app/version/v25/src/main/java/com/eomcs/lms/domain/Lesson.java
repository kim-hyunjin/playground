package com.eomcs.lms.domain;

public class Lesson {
  private int no;
  private String title;
  private String description;
  private String startDate;
  private String endDate;
  private int totalHours;
  private int dayHours;
  
  @Override
  public boolean equals(Object obj) {
    if (obj.getClass() != Lesson.class)
      return false;
    
    Lesson other = (Lesson) obj;
    
    if (this.no != other.no)
      return false;
    
    if (!this.title.equals(other.title))
      return false;
    
    if (!this.description.equals(other.description))
      return false;
    
    if (!this.startDate.equals(other.startDate))
      return false;
    
    if (!this.endDate.equals(other.endDate))
      return false;
    
    if (this.totalHours != other.totalHours)
      return false;
    
    if (this.dayHours != other.dayHours)
      return false;
    
    return true;
  }
  
  public int getNo() {
    return no;
  }
  public void setNo(int no) {
    this.no = no;
  }
  public String getTitle() {
    return title;
  }
  public void setTitle(String title) {
    this.title = title;
  }
  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }
  public String getStartDate() {
    return startDate;
  }
  public void setStartDate(String startDate) {
    this.startDate = startDate;
  }
  public String getEndDate() {
    return endDate;
  }
  public void setEndDate(String endDate) {
    this.endDate = endDate;
  }
  public int getTotalHours() {
    return totalHours;
  }
  public void setTotalHours(int totalHours) {
    this.totalHours = totalHours;
  }
  public int getDayHours() {
    return dayHours;
  }
  public void setDayHours(int dayHours) {
    this.dayHours = dayHours;
  }
}
