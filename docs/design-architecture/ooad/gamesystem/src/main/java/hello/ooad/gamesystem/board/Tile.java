package hello.ooad.gamesystem.board;

import hello.ooad.gamesystem.Unit;

import java.util.LinkedList;
import java.util.List;

public class Tile {

    private List<Unit> units;

    public Tile() {
        units = new LinkedList<>();
    }

    protected void addUnit(Unit unit) {
        units.add(unit);
    }

    protected List<Unit> getUnits() {
        return units;
    }

    protected void removeUnit(Unit unit) {
        units.remove(unit);
    }

    protected void removeUnits() {
        units = new LinkedList<>();
    }
}