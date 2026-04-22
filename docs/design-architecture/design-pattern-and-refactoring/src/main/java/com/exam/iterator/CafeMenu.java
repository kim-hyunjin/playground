package com.exam.iterator;

import java.util.Hashtable;
import java.util.Iterator;

public class CafeMenu implements Menu{
    Hashtable menuItems = new Hashtable();

    public CafeMenu() {
        addItem("베지 버거와 에어 프라이", "통밀빵, 상추, 토마토, 감자튀김이 첨가된 베지 버거", true, 4000);
        addItem("오늘의 스프", "샐러드가 곁들여진 오늘의 스프", false, 3500);
        addItem("베리또", "통 핀토콩과 살사, 구아카몰이 곁들여진 푸짐한 베리또", true, 4300);
    }

    private void addItem(String name, String description, boolean vegetarian, int price) {
        MenuItem menuItem = new MenuItem(name, description, vegetarian, price);
        menuItems.put(menuItem.getName(), menuItem);
    }

    @Override
    public Iterator createIterator() {
        return menuItems.values().iterator();
    }

//    public Hashtable getItems() {
//        return menuItems;
//    }
}
