//package com.exam.iterator;
//
//import java.util.ArrayList;
//import java.util.Iterator;
//
//public class PancakeHouseMenuIterator implements Iterator {
//    private ArrayList<MenuItem> menuItems;
//    private int position;
//
//    public PancakeHouseMenuIterator(ArrayList<MenuItem> menuItems) {
//        this.menuItems = menuItems;
//        position = 0;
//    }
//
//    @Override
//    public boolean hasNext() {
//        return position < menuItems.size() && menuItems.get(position) != null;
//    }
//
//    @Override
//    public Object next() {
//        MenuItem menuItem = menuItems.get(position);
//        position++;
//        return menuItem;
//    }
//}
