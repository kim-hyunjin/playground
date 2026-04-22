import 'package:flutter/material.dart';
import 'package:meals_app/data/dummy_category.dart';
import 'package:meals_app/models/category.dart';
import 'package:meals_app/models/meal.dart';
import 'package:meals_app/screens/meals_screen.dart';
import 'package:meals_app/widgets/category_grid_item.dart';

class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({
    super.key,
    required this.availableMeals,
  });

  final List<Meal> availableMeals;

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
      lowerBound: 0, // default: 0
      upperBound: 1, // default: 1
    );

    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _selectCategory(BuildContext context, Category category) {
    final meals = widget.availableMeals
        .where((element) => element.categories.contains(category.id))
        .toList();

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => MealsScreen(
          title: category.title,
          meals: meals,
        ),
      ),
    ); // Navigator.push(context, route);
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animationController,
      builder: (ctx, child) {
        // return Padding(
        //   padding: EdgeInsets.only(top: 100 - _animationController.value * 100),
        //   child: child,
        // );

        // more optimized and more capability with built-in Class SlideTransition
        // return SlideTransition(
        //   position: _animationController.drive(Tween(
        //     begin: const Offset(0, 0.3), // y-axis 30% down
        //     end: const Offset(0, 0),
        //   )),
        //   child: child,
        // );

        return SlideTransition(
            position: Tween(
              begin: const Offset(0, 0.3), // y-axis 30% down
              end: const Offset(0, 0),
            ).animate(CurvedAnimation(
              parent: _animationController,
              curve: Curves.easeInOut,
            )),
            child: child);
      },
      child: GridView(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 3 / 2,
            crossAxisSpacing: 20,
            mainAxisSpacing: 20),
        children: availableCategories
            .map((category) => CategoryGridItem(
                  category: category,
                  onSelectCategory: () {
                    _selectCategory(context, category);
                  },
                ))
            .toList(),
      ),
    );
  }
}
