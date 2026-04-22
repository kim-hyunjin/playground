void main() throws InterruptedException {
//    Thread thread = new Thread() {
//        public void run() {
//            System.out.println("We are in thread: " + Thread.currentThread().getName());
//            System.out.println("Current thread priority is " + Thread.currentThread().getPriority());
//            throw new RuntimeException("Intentional Exception");
//        }
//    };
//    thread.setName("New Worker Thread");
//
//    thread.setPriority(Thread.MAX_PRIORITY);
//
//    thread.setUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
//        public void uncaughtException(Thread t, Throwable e) {
//            System.out.println("Uncaught exception in thread: " + t.getName() + " the error is " + e.getMessage());
//        }
//    });
//
//    System.out.println("We are in thread: " + Thread.currentThread().getName());
//    thread.start();
//    System.out.println("We are in thread: " + Thread.currentThread().getName());
//
//    Thread.sleep(10000);

    Random random = new Random();
    Vault vault = new Vault(random.nextInt(MAX_PASSWORD));
    List<Thread> threads = new ArrayList<>();
    threads.add(new AscHackerThread(vault));
    threads.add(new DescHackerThread(vault));
    threads.add(new PoliceThread());

    for (Thread thread : threads) {
        thread.start();
    }
}

private static class NewThread extends Thread {
    public void run() {
        System.out.println("We are in thread: " + Thread.currentThread().getName());
    }
}

public static final int MAX_PASSWORD = 5000;

private static class Vault {
    private final int password;
    public Vault(int password) {
        this.password = password;
    }

    public boolean isCorrectPassword(int guess) {
        try {
            Thread.sleep(5);
        } catch (InterruptedException e) {

        }
        return password == guess;
    }
}

private static abstract class HackerThread extends Thread {
    protected Vault vault;

    public HackerThread(Vault vault) {
        this.vault = vault;
        this.setName(this.getClass().getSimpleName());
        this.setPriority(Thread.MAX_PRIORITY);
    }

    @Override
    public void start() {
        System.out.println("Starting thread " + this.getName());
        super.start();
    }
}

private static class AscHackerThread extends HackerThread {
    public AscHackerThread(Vault vault) {
        super(vault);
    }

    @Override
    public void run() {
        for (int guess = 0; guess < MAX_PASSWORD; guess++) {
            if(vault.isCorrectPassword(guess)) {
                System.out.println(this.getName() + " guessed the password " + guess);
                System.exit(0);
            }
        }
    }
}

private static class DescHackerThread extends HackerThread {
    public DescHackerThread(Vault vault) {
        super(vault);
    }

    @Override
    public void run() {
        for (int guess = MAX_PASSWORD; guess >= 0; guess--) {
            if(vault.isCorrectPassword(guess)) {
                System.out.println(this.getName() + " guessed the password " + guess);
                System.exit(0);
            }
        }
    }
}

private static class PoliceThread extends Thread {
    @Override
    public void run() {
        for (int i = 10; i > 0; i--) {
            try {
                Thread.sleep(1000);
            }  catch (InterruptedException e) {}
            System.out.println(i);
        }
        System.out.println("Game over for you hackers");
        System.exit(0);

    }
}