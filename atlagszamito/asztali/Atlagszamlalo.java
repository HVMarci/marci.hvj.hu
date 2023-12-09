import java.util.Scanner;
public class Atlagszamito {
   public static void main(String[] args) {
      double elerniAtlag = 4.51D;
      if (args.length > 0) {
         elerniAtlag = Double.parseDouble(args[0].replaceAll(",", "."));
      }
      if (elerniAtlag >= 5.0D) {
         throw new RuntimeException("Az átlagod nem lehet kereken 5, vagy annál több!");
      } else {
         Scanner sc = new Scanner(System.in);
         System.out.println("Írd be at átlagodat!");
         double atlag = Double.parseDouble(sc.nextLine().replaceAll(",", "."));
         System.out.println("Írd be a jegyeid számát!");
         int jegyszam = sc.nextInt();
         int otosSzamlalo;
         for(otosSzamlalo = 0; atlag < elerniAtlag; ++otosSzamlalo) {
            double temp = atlag * (double)jegyszam;
            temp += 5.0D;
            ++jegyszam;
            atlag = temp / (double)jegyszam;
         }
         System.out.println((otosSzamlalo + " ötöst kell még szerezned ahhoz, hogy elérd a következő átlagot: " + elerniAtlag).replaceAll("\\.", ","));
         sc.close();
      }
   }
}