import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
import java.awt.Color;
import java.awt.GridLayout;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.text.DecimalFormat;
import java.util.Random;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class CoinPriceTracker {

    private static final DecimalFormat PRICE_FORMAT = new DecimalFormat("#,##0.00");

    public static void main(String[] args) {
        PricesContainer pricesContainer = new PricesContainer();
        PriceUpdater priceUpdater = new PriceUpdater(pricesContainer);
        priceUpdater.setDaemon(true);
        priceUpdater.start();

        SwingUtilities.invokeLater(() -> createAndShowUI(pricesContainer));
    }

    private static void createAndShowUI(PricesContainer pricesContainer) {
        JFrame frame = new JFrame("Crypto Prices");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JPanel panel = new JPanel(new GridLayout(5, 2, 10, 6));
        JLabel bitcoinPriceLabel = new JLabel();
        JLabel etherPriceLabel = new JLabel();
        JLabel litecoinPriceLabel = new JLabel();
        JLabel bitcoinCashPriceLabel = new JLabel();
        JLabel ripplePriceLabel = new JLabel();

        Color hoverColor = new Color(0, 102, 204);
        JLabel bitcoinNameLabel = new JLabel("Bitcoin (BTC):");
        JLabel etherNameLabel = new JLabel("Ether (ETH):");
        JLabel litecoinNameLabel = new JLabel("Litecoin (LTC):");
        JLabel bitcoinCashNameLabel = new JLabel("Bitcoin Cash (BCH):");
        JLabel rippleNameLabel = new JLabel("Ripple (XRP):");

        installHoverColor(bitcoinNameLabel, hoverColor);
        installHoverColor(etherNameLabel, hoverColor);
        installHoverColor(litecoinNameLabel, hoverColor);
        installHoverColor(bitcoinCashNameLabel, hoverColor);
        installHoverColor(rippleNameLabel, hoverColor);

        panel.add(bitcoinNameLabel);
        panel.add(bitcoinPriceLabel);
        panel.add(etherNameLabel);
        panel.add(etherPriceLabel);
        panel.add(litecoinNameLabel);
        panel.add(litecoinPriceLabel);
        panel.add(bitcoinCashNameLabel);
        panel.add(bitcoinCashPriceLabel);
        panel.add(rippleNameLabel);
        panel.add(ripplePriceLabel);

        frame.setContentPane(panel);
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);

        Thread uiUpdater = new Thread(() -> {
            while (true) {
                if (pricesContainer.getLockObject().tryLock()) {
                    try {
                        double bitcoin = pricesContainer.getBitcoinPrice();
                        double ether = pricesContainer.getEtherPrice();
                        double litecoin = pricesContainer.getLitecoinPrice();
                        double bitcoinCash = pricesContainer.getBitcoinCashPrice();
                        double ripple = pricesContainer.getRipplePrice();

                        SwingUtilities.invokeLater(() -> {
                            bitcoinPriceLabel.setText("$" + PRICE_FORMAT.format(bitcoin));
                            etherPriceLabel.setText("$" + PRICE_FORMAT.format(ether));
                            litecoinPriceLabel.setText("$" + PRICE_FORMAT.format(litecoin));
                            bitcoinCashPriceLabel.setText("$" + PRICE_FORMAT.format(bitcoinCash));
                            ripplePriceLabel.setText("$" + PRICE_FORMAT.format(ripple));
                        });
                    } finally {
                        pricesContainer.getLockObject().unlock();
                    }
                }


                try {
                    Thread.sleep(16);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        });
        uiUpdater.setDaemon(true);
        uiUpdater.start();
    }

    private static void installHoverColor(JLabel label, Color hoverColor) {
        Color normalColor = label.getForeground();
        label.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                label.setForeground(hoverColor);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                label.setForeground(normalColor);
            }
        });
    }

    public static class PricesContainer {
        private Lock lockObject = new ReentrantLock();

        private double bitcoinPrice;
        private double etherPrice;
        private double litecoinPrice;
        private double bitcoinCashPrice;
        private double ripplePrice;

        public Lock getLockObject() {
            return lockObject;
        }

        public double getBitcoinPrice() {
            return bitcoinPrice;
        }

        public void setBitcoinPrice(double bitcoinPrice) {
            this.bitcoinPrice = bitcoinPrice;
        }

        public double getEtherPrice() {
            return etherPrice;
        }

        public void setEtherPrice(double etherPrice) {
            this.etherPrice = etherPrice;
        }

        public double getLitecoinPrice() {
            return litecoinPrice;
        }

        public void setLitecoinPrice(double litecoinPrice) {
            this.litecoinPrice = litecoinPrice;
        }

        public double getBitcoinCashPrice() {
            return bitcoinCashPrice;
        }

        public void setBitcoinCashPrice(double bitcoinCashPrice) {
            this.bitcoinCashPrice = bitcoinCashPrice;
        }

        public double getRipplePrice() {
            return ripplePrice;
        }

        public void setRipplePrice(double ripplePrice) {
            this.ripplePrice = ripplePrice;
        }
    }

    public static class PriceUpdater extends Thread {
        private PricesContainer pricesContainer;
        private Random random = new Random();

        public PriceUpdater(PricesContainer pricesContainer) {
            this.pricesContainer = pricesContainer;
        }

        @Override
        public void run() {
            while (true) {
                pricesContainer.getLockObject().lock();

                try {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                    }
                    pricesContainer.setBitcoinPrice(random.nextInt(20000));
                    pricesContainer.setEtherPrice(random.nextInt(2000));
                    pricesContainer.setLitecoinPrice(random.nextInt(500));
                    pricesContainer.setBitcoinCashPrice(random.nextInt(5000));
                    pricesContainer.setRipplePrice(random.nextDouble());
                } finally {
                    pricesContainer.getLockObject().unlock();
                }

                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                }
            }
        }
    }
}
