package com.eomcs.lms;

import javax.sql.DataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.transaction.PlatformTransactionManager;

// Spring IoC 컨테이너가 탐색할 패키지 설정
@ComponentScan(value = "com.eomcs.lms")

// Spring IoC 컨테이너에서 사용할 Properties 파일을 로딩하기
@PropertySource("classpath:com/eomcs/lms/conf/jdbc.properties")

// Mybatis Dao 프록시를 자동생성 할 인터페이스를 지정한다.
@MapperScan("com.eomcs.lms.dao")

public class AppConfig {

  // @PropertySource로 로딩한 .properties 파일의 값을 사용하고 싶다면,
  // 다음 애노테이션을 인스턴스 필드 앞에 붙여라.
  // Spring IoC 컨테이너가 이 클래스의 객체를 생성할 때
  // 해당 필드에 값을 넣어준다.
  @Value("${jdbc.driver}")
  String jdbcDriver;
  @Value("${jdbc.url}")
  String jdbcUrl;
  @Value("${jdbc.username}")
  String jdbcUsername;
  @Value("${jdbc.password}")
  String jdbcPassword;


  // Spring IoC 컨테이너에 수동으로 등록할 객체를 등록하고 싶다면
  // 그 객체를 만들어주는 팩토리 메서드를 정의해야 한다.
  // 단, 메서드 선언부에 @Bean 애노테이션을 붙여야 한다.
  // 그래야만 Spring IoC 컨테이너가 메서드를 호출하고 그 리턴 값을 보관한다.

  @Bean
  public DataSource dataSource() {
    DriverManagerDataSource ds = new DriverManagerDataSource();
    ds.setDriverClassName(jdbcDriver);
    ds.setUrl(jdbcUrl);
    ds.setUsername(jdbcUsername);
    ds.setPassword(jdbcPassword);
    return ds;
  }

  @Bean
  public SqlSessionFactory sqlSessionFactory(DataSource dataSource, // DB커넥션풀
      ApplicationContext appCtx) // Spring IoC 컨테이너
      throws Exception {
    // Spring IoC 컨테이너 용으로 mybatis에서 따로 제작한
    // SqlSessionFactory이다.
    SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
    sqlSessionFactoryBean.setDataSource(dataSource);
    sqlSessionFactoryBean.setTypeAliasesPackage("com.eomcs.lms.domain");
    // Spring IoC 컨테이너를 통해 SQL 맵퍼 파일의 위치 정보를 가져온다.
    sqlSessionFactoryBean
        .setMapperLocations(appCtx.getResources("classpath:com/eomcs/lms/mapper/*Mapper.xml"));
    return sqlSessionFactoryBean.getObject();
  }

  @Bean
  public PlatformTransactionManager transactionManager(
      // 필요한 값이 있다면 이렇게 파라미터로 선언만 하라.
      // 단 IoC 컨테이너 안에 들어있는 값이어야 한다.
      DataSource dataSource) {
    return new DataSourceTransactionManager(dataSource);
  }
}
