package com.exam.iterator;

import java.util.Iterator;

public class DinerMenu implements Menu{
    static final int MAX_ITEMS = 6;
    int numberOfItems = 0;
    MenuItem[] menuItems;

    public DinerMenu() {
        menuItems = new MenuItem[MAX_ITEMS];

        addItem("채식주의자용 BLT", "통밀 위에 식물성 베이컨, 상추, 토마토를 얹은 메뉴", true, 3000);
        addItem("BLT", "통밀 위에 베이컨, 상추, 토마토를 얹은 메뉴", false, 3000);
        addItem("오늘의 스프", "감자 샐러드를 곁들인 오늘의 스프", false, 3300);
        addItem("핫도그", "사워크라우트, 갖은 양념, 양파, 치즈가 곁들여진 핫도그", false, 3000);


    }

    public void addItem(String name, String description, boolean vegetarian, int price) {
        MenuItem menuItem = new MenuItem(name, description, vegetarian, price);
        if (numberOfItems >= MAX_ITEMS) {
            System.out.println("죄송합니다. 메뉴가 꽉찼습니다. 더 이상 추가할 수 없습니다.");
        } else {
            menuItems[numberOfItems] = menuItem;
            numberOfItems++;
        }
    }

//    public MenuItem[] getMenuItems() {
//        return menuItems;
//    }
    public Iterator createIterator() { // 클라이언트에서는 menuItem이 어떻게 관리되는지 알 필요 없다. 그냥 반복자를 사용해 항목에 하나씩 접근할 수 있으면 된다.
        return new DinerMenuIterator(menuItems);
    }
}
